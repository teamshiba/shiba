/**
 * @desc the footer layout for all pages.
 */

import React, {FC} from "react";
import {History} from "history";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import PeopleIcon from '@material-ui/icons/People';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PersonIcon from '@material-ui/icons/Person';

const PATHS = [
    "/room/active",
    "/room/history",
    "/user/profile"
]

interface IProps {
    history: History
}

const Footer: FC<IProps> = props => {
    const path = props.history.location.pathname;
    const value = PATHS.findIndex(p => path.startsWith(p));
    return (
        <BottomNavigation value={value}
                          onChange={(_, val) => {
                              props.history.push(PATHS[val]);
                          }}
                          showLabels>
            <BottomNavigationAction label="Rooms" icon={<PeopleIcon/>}/>
            <BottomNavigationAction label="History" icon={<PeopleOutlineIcon/>}/>
            <BottomNavigationAction label="Profile" icon={<PersonIcon/>}/>
        </BottomNavigation>
    )
};

export default Footer;
