/**
 * @desc when user need to add items to the list for voting.
 */

import React, {FC, Fragment, useEffect} from "react";
import Header from "../../components/Header";
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import TinderCard from 'react-tinder-card'
import {votingStore} from "../../stores/voting-store"
import './index.css'
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {browserHistory} from "../../common/utils";
import {Clear, Equalizer, Favorite} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {groupStore} from "../../stores/group-store";
import {VotingItem} from "../../domain/voting-item";

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

const fakeItems: VotingItem[] = [{
    itemId: "north-india-restaurant-san-francisco",
    imgURL: "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
    name: "North India Restaurant",
}, {
    itemId: "molinari-delicatessen-san-francisco",
    imgURL: "http://s3-media4.fl.yelpcdn.com/bphoto/6He-NlZrAv2mDV-yg6jW3g/o.jpg",
    name: "Molinari Delicatessen",
}];

type IProps = RouteComponentProps<{ id: string }>

const Voting: FC<IProps> = observer((props) => {
    const roomId = props.match.params["id"];
    const roomVotingStore = votingStore.room(roomId);
    const groupProfileStore = groupStore.room(roomId);
    const classes = useStyles();

    // Always do an update when page loads
    useEffect(() => {
        roomVotingStore.updateItems();
        groupProfileStore.update();
    }, []);

    // Jump to stats page if finished
    useEffect(() => {
        if (groupProfileStore.data?.isCompleted) {
            browserHistory.push(`/room/${roomId}/stats`);
        }
    }, [groupProfileStore.data?.isCompleted])

    // Polling for updates when there's no items left to swipe
    useEffect(() => {
        if (roomVotingStore.items.size > 0 || groupProfileStore.data?.isCompleted) {
            return;
        }

        const interval = setInterval(() => {
            roomVotingStore.updateItems();
            groupProfileStore.update();
        }, 3000);

        return () => clearInterval(interval);
    }, [roomVotingStore.items.size, groupProfileStore.data?.isCompleted]);

    if (groupProfileStore.data == null) return null;

    const onCardLeftScreen = (direction: string, item: string) => {
        roomVotingStore.vote(item, direction == "left" ? "like" : "dislike");
    }

    let content;
    const items = [...roomVotingStore.items.values()];
    if (roomVotingStore.items.size > 0) {
        content = <div className="cardContainer">
            {items.map((item
                ) =>
                    <div className="swipe" key={item.itemId}>
                        <TinderCard onCardLeftScreen={(dir) => onCardLeftScreen(dir, item.itemId)}
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
        const message = roomVotingStore.voted ?
            "Wait for other people to finished or click add button to add more items" :
            "Click add button to add more items";

        content = <div className="message">{message}</div>;
    }

    const hasItem = items.length > 0;

    const handleAdd = async () => {
        for (const item of fakeItems) {
            await roomVotingStore.addItem(item);
        }

        await roomVotingStore.updateItems();
    }

    content =
        <div className="screen">
            {content}
            <div className="voting-buttons">
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}
                                onClick={() => browserHistory.push(`/room/${roomId}/stats`)}>
                        <Equalizer className={`${classes.statsButton} ${classes.votingButton}`}/>
                    </IconButton>
                </div>
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}
                                disabled={!hasItem}
                                onClick={() => roomVotingStore.vote(items[0].itemId, "like")}>
                        <Favorite className={`${hasItem && classes.likeButton} ${classes.votingButton}`}/>
                    </IconButton>
                </div>
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg}
                                disabled={!hasItem}
                                onClick={() => roomVotingStore.vote(items[0].itemId, "dislike")}>
                        <Clear className={`${hasItem && classes.dislikeButton} ${classes.votingButton}`}/>
                    </IconButton>
                </div>
                <div className={classes.votingButtonBgContainer}>
                    <IconButton className={classes.votingButtonBg} onClick={handleAdd}>
                        <AddOutlinedIcon className={`${classes.addButton} ${classes.votingButton}`}/>
                    </IconButton>
                </div>
            </div>
        </div>

    return (
        <Fragment>
            <Header hasBackButton buttons={
                <IconButton onClick={() => browserHistory.push(`/room/${roomId}/profile`)}>
                    <EditOutlinedIcon/>
                </IconButton>
            }>
                {groupProfileStore.data.roomName}
            </Header>
            {content}
        </Fragment>
    )
})

export default Voting;