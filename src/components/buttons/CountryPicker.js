import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Flag from "react-world-flags";
import "./Buttons.scss";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

export default function DialogSelect() {
  const classes = useStyles();
  const context = useContext(GlobalContext);
  const [state, setState] = React.useState({
    open: false,
    locale: context.locale
  });
  const locale = context.locale;
  var lang = CustomLanguage.define(locale);  

  const handleChange = event => {
    setState({ ...state, locale: String(event.target.value) });
  };

  const handleClickOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
    context.setLocale(state.locale);
  };

  return (
    <div className="btn-country-picker">
      <Button onClick={handleClickOpen}>
        <Flag code={state.locale === "en" ? "US" : state.locale.toUpperCase()} height="16" />
      </Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={state.open}
        onClose={handleClose}
      >
        <DialogTitle>{lang.country_picker[0].title}</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="locale-native-simple">{lang.country_picker[0].list_title}</InputLabel>
              <Select
                native
                value={state.locale}
                onChange={handleChange}
                input={<Input id="locale-native-simple" />}
              >
                <option value={"en"}>English</option>
                <option value={"es"}>Español</option>
                <option value={"fr"}>Français</option>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
