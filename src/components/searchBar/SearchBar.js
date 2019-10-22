import React, { useState } from "react";
import "../buttons/Buttons.scss";
import "./SearchBar.scss";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
/* import SearchContext from '../../context/SearchContext' */

const Search = ({ search }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchInputChanges = e => {
        setSearchValue(e.target.value);
    };

    const resetInputField = () => {
        setSearchValue("");
    };

    const callSearchFunction = e => {
        e.preventDefault();
        search(searchValue);
        resetInputField();
    };

    return (
        <GlobalContext.Consumer>
            {context => {
                const locale = context.locale;
                var lang = CustomLanguage.define(locale);
                return (
                    <div className="row">
                        <form className="search">
                            <input
                                value={searchValue}
                                onChange={handleSearchInputChanges}
                                type="text"
                                className="search-input-field s1"
                                placeholder={lang.search[0].placeholder}
                            />
                            <button
                                disabled={searchValue.length < 2}
                                onClick={callSearchFunction}
                                type="submit"
                                id="submitSearchButton"
                                className="btn btn-secondary btn-medium waves-effect"
                                value={lang.search[0].search}
                            >
                                {lang.search[0].search}
                            </button>
                        </form>
                    </div>
                );
            }}
        </GlobalContext.Consumer>
    );
};

export default Search;
