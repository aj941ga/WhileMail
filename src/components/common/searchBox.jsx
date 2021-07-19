import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const SearchBox = ({ value, onChange }) => {
  return (
    <TextField
      id="outlined-search"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      label={
        <>
          <SearchIcon />
        </>
      }
      type="search"
      fullWidth
      // helperText="search"
      variant="outlined"
      size="small"
    />
  );
};

export default SearchBox;
