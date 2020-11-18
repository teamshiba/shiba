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
import GroupStore from "../../stores/group-store";
import './index.css'
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {browserHistory} from "../../common/utils";

type IProps = RouteComponentProps<{ id: string }>

const Voting: FC<IProps> = observer((props) => {
    const roomId = props.match.params["id"];
    const votingStore = useContext(VotingStore).room(roomId);
    const groupProfileStore = useContext(GroupStore).room(roomId);

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

    return (
        <Fragment>
            <Header hasBackButton buttons={[
                <IconButton> <AddOutlinedIcon/> </IconButton>,
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