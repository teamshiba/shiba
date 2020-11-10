import React, {FC} from "react";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    logo: {
        height: "100%"
    }
}));

const ShibaLogo: FC = () => {
    const classes = useStyles();

    return <img src="/shiba-logo.png" className={classes.logo}/>;
}

export default ShibaLogo;