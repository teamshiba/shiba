import React, {FC, useState} from "react";
import Input from "@material-ui/core/Input";
import {InputAdornment} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

interface IProps {
    value: string;
    onSubmit: (value: string) => void;
    className?: string;
}

const EditInput: FC<IProps> = (props) => {
    const [isEditing, setEditing] = useState(false);
    const [value, setValue] = useState(props.value);

    if (isEditing) {
        const handleSubmit = () => {
            props.onSubmit(value);
            setEditing(false);
        };

        return <Input className={props.className}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      endAdornment={
                          <InputAdornment position="end">
                              <IconButton onClick={handleSubmit}>
                                  <CheckIcon/>
                              </IconButton>
                          </InputAdornment>}/>
    } else {
        return <Input className={props.className} value={props.value}
                      endAdornment={
                          <InputAdornment position="end">
                              <IconButton onClick={() => setEditing(true)}>
                                  <EditIcon/>
                              </IconButton>
                          </InputAdornment>}/>
    }
}

export default EditInput;