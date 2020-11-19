/**
 * @desc when user need to add items to the list for voting.
 */

import React, {FC, Fragment, useContext, useEffect} from "react";
import Header from "../../components/Header";
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import TinderCard from 'react-tinder-card'
import VotingStore from "../../stores/voting-store";
import './index.css'
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {browserHistory} from "../../common/utils";
import {Clear, Equalizer, Favorite} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {groupStore} from "../../stores/group-store";

const useStyles = makeStyles(() => ({
    votingButtonBgContainer: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#F0F0F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    votingButtonBg: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'white',
    },
    votingButton: {
        fontSize: '30px',
        borderRadius: '50%'
    },
    statsButton: {
        color: '#6FCF97'
    },
    dislikeButton: {
        color: '#EB5757'
    },
    likeButton: {
        color: '#F2994A'
    },
    addButton: {
        color: '#2F80ED'
    }
}));

type IProps = RouteComponentProps<{ id: string }>

const Voting: FC<IProps> = observer((props) => {
    const roomId = props.match.params["id"];
    const votingStore = useContext(VotingStore).room(roomId);
    const groupProfileStore = groupStore.room(roomId);
    const classes = useStyles();

    useEffect(() => {
        votingStore.updateItems();
        groupProfileStore.update();
    }, []);

    // Polling for updates when there's no items left to swipe
    useEffect(() => {
        if (votingStore.items.size > 0 || groupProfileStore.data?.isCompleted) {
            return;
        }

        const interval = setInterval(() => {
            votingStore.updateItems();
            groupProfileStore.update();
        }, 3000);

        return () => clearInterval(interval);
    }, [votingStore.items.size, groupProfileStore.data?.isCompleted]);

    if (groupProfileStore.data == null) return null;

    const onCardLeftScreen = (direction: string, item: string) => {
        votingStore.vote(item, direction == "left" ? "like" : "dislike");
    }

    let content;
    if (votingStore.items.size > 0) {
        content = <div className="cardContainer">
            {[...votingStore.items.values()].map((item
                ) =>
                    <div className="swipe" key={item.id}>
                        <TinderCard onCardLeftScreen={(dir) => onCardLeftScreen(dir, item.id)}
                                    preventSwipe={['up', 'down']}>
                            <div style={{backgroundImage: 'url(' + item.imgURL + ')'}} className='card'>
                                <h3>{item.name}</h3>
                            </div>
                        </TinderCard>
                    </div>
            )}
        </div>;
    } else if (groupProfileStore.data.isCompleted) {
        content = <div className="message">Placeholder for real matching result</div>
    } else {
        const message = votingStore.voted ?
            "Wait for other people to finished or click add button to add more items" :
            "Click add button to add more items";

        content = <div className="message">{message}</div>;
    }

    content =
        <div className="screen">
            {content}
            <div className="voting-buttons">
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}>
                        <Equalizer
                            className={`${classes.statsButton} ${classes.votingButton}`}
                            onClick={() => browserHistory.push(`/room/${roomId}/stats`)}/>
                    </IconButton>
                </div>
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}> <Clear
                        className={`${classes.dislikeButton} ${classes.votingButton}`}/> </IconButton>
                </div>
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}> <Favorite
                        className={`${classes.likeButton} ${classes.votingButton}`}/> </IconButton>
                </div>
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}> <AddOutlinedIcon
                        className={`${classes.addButton} ${classes.votingButton}`}/> </IconButton>
                </div>
            </div>
        </div>

    return (
        <Fragment>
            <Header hasBackButton buttons={[
                <IconButton>
                    <EditOutlinedIcon onClick={() => browserHistory.push(`/room/${roomId}/profile`)}/>
                </IconButton>
            ]}>
                {groupProfileStore.data.roomName}
            </Header>
            {content}
        </Fragment>
    )
})

export default Voting;