const fs = require("fs");
const mime = require("mime");
const pump = require("pump");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const Movie = require("../schemas/Movie");
const User = require("../schemas/User");
const download = require("download");
const TorrentStream = require("torrent-stream");
const OS = require("opensubtitles-api");
const OpenSubtitles = new OS("TemporaryUserAgent");

const options = {
  connections: 100,
  uploads: 10,
  path: process.cwd() + "/API/torrents", // Where to save the files. Overrides `tmp`.
  verify: true,
  tracker: true, // Whether or not to use trackers from torrent file or magnet link
  // Defaults to true
  trackers: [
    "udp://tracker.openbittorrent.com:80",
    "udp://tracker.ccc.de:80",
    "udp://tracker.leechers-paradise.org:6969/announce",
    "udp://tracker.pirateparty.gr:6969/announce",
    "udp://tracker.coppersurfer.tk:6969/announce",
    "http://asnet.pw:2710/announce",
    "http://tracker.opentrackr.org:1337/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://tracker1.xku.tv:6969/announce",
    "udp://tracker1.wasabii.com.tw:6969/announce",
    "udp://tracker.zer0day.to:1337/announce",
    "udp://p4p.arenabg.com:1337/announce",
    "http://tracker.internetwarriors.net:1337/announce",
    "udp://tracker.internetwarriors.net:1337/announce",
    "udp://allesanddro.de:1337/announce",
    "udp://9.rarbg.com:2710/announce",
    "udp://tracker.dler.org:6969/announce",
    "http://mgtracker.org:6969/announce",
    "http://tracker.mg64.net:6881/announce",
    "http://tracker.devil-torrents.pl:80/announce",
    "http://ipv4.tracker.harry.lu:80/announce",
    "http://tracker.electro-torrent.pl:80/announce"
  ]
};

module.exports = {
  getSubtitles: async (req, res, next) => {
    var movieId = req.params.movieId;
    await OpenSubtitles.search({
      sublanguageid: ["fre", "eng", "spa"].join(),
      extensions: "srt",
      imdbid: movieId
    }).then(async subtitles => {
      var subPath = process.cwd() + "/src/subtitles/";
      var subPathEn = undefined;
      var subPathEs = undefined;
      var subPathFr = undefined;
      if (
        subtitles.en &&
        subtitles.en.vtt &&
        !fs.existsSync(subPath + movieId + "_" + "en.vtt")
      ) {
        await download(subtitles.en.vtt)
          .then(data => {
            fs.writeFileSync(subPath + movieId + "_" + "en.vtt", data);
          })
          .catch(err => {
            console.log("No english subtitles");
          });
        subPathEn = fs.existsSync(subPath + movieId + "_" + "en.vtt")
          ? movieId + "_" + "en.vtt"
          : undefined;
      } else if (fs.existsSync(subPath + movieId + "_" + "en.vtt")) {
        subPathEn = movieId + "_" + "en.vtt";
      }
      if (
        subtitles.es &&
        subtitles.es.vtt &&
        !fs.existsSync(subPath + movieId + "_" + "es.vtt")
      ) {
        await download(subtitles.es.vtt)
          .then(data => {
            fs.writeFileSync(subPath + movieId + "_" + "es.vtt", data);
          })
          .catch(err => {
            console.log("No spanish subtitles");
          });
        subPathEs = fs.existsSync(subPath + movieId + "_" + "es.vtt")
          ? movieId + "_" + "es.vtt"
          : undefined;
      } else if (fs.existsSync(subPath + movieId + "_" + "es.vtt")) {
        subPathEs = movieId + "_" + "es.vtt";
      }
      if (
        subtitles.fr &&
        subtitles.fr.vtt &&
        !fs.existsSync(subPath + movieId + "_" + "fr.vtt")
      ) {
        await download(subtitles.fr.vtt)
          .then(data => {
            fs.writeFileSync(subPath + movieId + "_" + "fr.vtt", data);
          })
          .catch(err => {
            console.log("No french subtitles");
          });
        subPathFr = fs.existsSync(subPath + movieId + "_" + "fr.vtt")
          ? movieId + "_" + "fr.vtt"
          : undefined;
      } else if (fs.existsSync(subPath + movieId + "_" + "fr.vtt")) {
        subPathFr = movieId + "_" + "fr.vtt";
      }
      //console.log(subPathEn, subPathEs, subPathFr);
      return res.status(200).json({ subPathEn, subPathEs, subPathFr });
    });
  },

  convertVideo: async (res, path, start, end, mode) => {
    let stream;
    if (mode === 0) {
      stream = path.createReadStream();
    } else {
      stream = fs.createReadStream(path);
    }

    var newStream = ffmpeg({
      source: stream
    })
      .videoCodec("libvpx")
      .videoBitrate(1024)
      .audioCodec("libopus")
      .audioBitrate(128)
      .outputOptions([
        "-crf 30",
        "-deadline realtime",
        "-cpu-used 2",
        "-threads 3"
      ])
      .format("webm")
      .on("progress", progress => {
        //console.log(progress);
      })
      .on("start", cmd => {
        console.log("Starting conversion...");
      })
      .on("end", () => {
        console.log("Conversion is done!");
      })
      .on("error", (err, stdout, stderr) => {
        console.log("Cannot process video: " + err.message);
      });

    pump(newStream, res);
  },

  streamMovie: async (res, path, start, end, mode) => {
    if (mode === 1) {
      if (
        mime.getType(path.name) !== "video/mp4" &&
        mime.getType(path.name) !== "video/ogg"
      ) {
        module.exports.convertVideo(res, path, start, end, 0);
      } else {
        let stream = path.createReadStream({
          start: start,
          end: end
        });
        pump(stream, res);
      }
    } else if (
      mime.getType(path) !== "video/mp4" &&
      mime.getType(path) !== "video/ogg"
    ) {
      module.exports.convertVideo(res, path, start, end, 1);
    } else {
      let stream = fs.createReadStream(path, {
        start: start,
        end: end
      });
      pump(stream, res);
    }
  },

  getMovieStream: async (req, res) => {
    var customPath = req.params.quality + "_" + req.params.source;
    if (req.params.uid === "undefined")
      return res.status(404).json({ error: "No user corresponding..." });
    Movie.findOne({ imdbId: req.params.movieId }, (err, result) => {
      if (err || result === null)
        return res.status(404).json({ error: "No movie corresponding..." });
      User.findOne({ _id: req.params.uid }, (err, user) => {
        if (err) console.log(err);
        var exists = false;
        user.movies_seen.forEach(e => {
          if (e === req.params.movieId) exists = true;
        });
        if (!exists) {
          user.movies_seen.push(req.params.movieId);
          user.save();
        }
      });
      var pathFile = undefined;
      if (result && result.path) {
        result.path.forEach(e => {
          if (e[customPath]);
          pathFile = e[customPath];
        });
        if (pathFile !== undefined && fs.existsSync(pathFile)) {
          const stat = fs.statSync(pathFile);
          const fileSize = stat.size;
          var otherstart = 0;
          var otherend = fileSize - 1;
          const range = req.headers.range;
          if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = end - start + 1;

            const head = {
              "Content-Range": `bytes ${start}-${end}/${fileSize}`,
              "Accept-Ranges": "bytes",
              "Content-Length": chunksize,
              "Content-Type": mime.getType(pathFile)
            };
            res.writeHead(206, head);
            module.exports.streamMovie(res, pathFile, start, end);
          } else {
            const head = {
              "Content-Length": fileSize,
              "Content-Type": mime.getType(pathFile)
            };
            res.writeHead(200, head);
            module.exports.streamMovie(res, pathFile, otherstart, otherend, 0);
          }
        } else
          module.exports.downloadMovie(
            req,
            res,
            req.params.movieId,
            req.params.quality,
            req.params.source
          );
      } else
        module.exports.downloadMovie(
          req,
          res,
          req.params.movieId,
          req.params.quality,
          req.params.source
        );
      result.lastViewed = new Date();
      result.save();
    });
  },

  downloadMovie: async (req, res, movieId, quality, source) => {
    try {
      Movie.findOne({ imdbId: movieId }, (err, result) => {
        if (err || result === null)
          return res.status(404).json({ error: "No movie corresponding..." });
        else if (result) {
          console.log("Processing download...");
          var magnet = undefined;
          result.torrents.forEach(element => {
            if (element.quality === quality && element.source === source)
              magnet = element.magnet;
          });
          if (magnet !== undefined) {
            if (source === "Popcorn Time") {
              magnet = magnet.split(":")[3];
              magnet = magnet.split("&")[0];
            } else {
              magnet = magnet.split("/");
              magnet = magnet[magnet.length - 1];
            }
            console.log("Magnet link: ", magnet);
            const engine = TorrentStream(magnet, options);

            var newFilePath;
            let fileSize;

            engine
              .on("ready", () => {
                engine.files.forEach(file => {
                  var ext = file.name.substr(-4, 4);
                  if (
                    ext === ".mp4" ||
                    ext === ".mkv" ||
                    ext === ".avi" ||
                    ext === ".ogg"
                  ) {
                    file.select();
                    if (ext !== ".mp4" && ".ogg") ext = ".webm";
                    fileSize = file.length;
                    newFilePath = process.cwd() + "/API/torrents/" + file.path;

                    const range = req.headers.range;
                    if (range) {
                      const parts = range.replace(/bytes=/, "").split("-");
                      const start = parseInt(parts[0], 10);
                      const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1;
                      const chunksize = end - start + 1;

                      const head = {
                        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type":
                          mime.getType(file.name) === "video/mp4" ||
                            mime.getType(file.name) === "video/ogg"
                            ? mime.getType(file.name)
                            : "video/webm",
                        Connection: "keep-alive"
                      };
                      if (
                        mime.getType(file.path) == "video/mp4" ||
                        mime.getType(file.path) == "video/ogg"
                      )
                        res.writeHead(206, head);
                      module.exports.streamMovie(res, file, start, end, 1);
                    } else {
                      const head = {
                        "Content-Length": fileSize,
                        "Content-Type":
                          mime.getType(file.name) === "video/mp4" ||
                            mime.getType(file.name) === "video/ogg"
                            ? mime.getType(file.name)
                            : "video/webm"
                      };
                      res.writeHead(200, head);
                      module.exports.streamMovie(res, file, 0, fileSize - 1, 1);
                    }
                  } else {
                    file.deselect();
                  }
                });
              })
              .on("download", () => {
                const downloaded =
                  Math.round((engine.swarm.downloaded / fileSize) * 100 * 100) /
                  100;

                console.log("Downloded: " + downloaded + "%");
              })
              .on("idle", () => {
                console.log("Download complete!");
                var update = quality + "_" + source;
                result.path.push({
                  [update]: newFilePath
                });
                result.lastViewed = new Date();
                result.save();
              });
          } else
            return res.status(404).json({ error: "No movie corresponding..." });
        } else
          return res.status(404).json({ error: "No movie corresponding..." });
      });
    } catch (err) { }
  },

  getMoviesFromImdbIdArray: async (req, res, next) => {
    await Movie.find({ imdbId: { $in: req.body.imdbIdArray } }, async function (
      err,
      movies
    ) {
      if (err) {
        return res
          .status(400)
          .json({ error: "Impossible to retrieve movies..." });
      }
      if (!movies) {
        return res
          .status(400)
          .json({ error: "Impossible to retrieve movies..." });
      } else {
        return res.status(200).json({ moviesList: movies });
      }
    });
  }
};
