/**
 * @desc when user need to add items to the list for voting.
 */

import React, { FC, Fragment, useEffect } from "react";
import Header from "../../components/Header";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import { votingStore } from "../../stores/voting-store";
import { groupStore } from "../../stores/group-store";
// import fetch from 'cross-fetch';
import TextField from "@material-ui/core/TextField";
// import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from "@material-ui/core/CircularProgress";
import { VotingItem } from "../../domain/voting-item";
import axios from "axios";
import { InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

type IProps = RouteComponentProps<{ id: string }>;

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const fakeRecItems: VotingItem[] = [
  {
    itemId: "rec-north-india-restaurant-san-francisco",
    imgURL:
      "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
    name: "Rec North India Restaurant",
    itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
  },
];

const fakeItems: VotingItem[] = [
  {
    itemId: "north-india-restaurant-san-francisco",
    imgURL:
      "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
    name: "North India Restaurant",
    itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
  },
  {
    itemId: "molinari-delicatessen-san-francisco",
    imgURL:
      "http://s3-media4.fl.yelpcdn.com/bphoto/6He-NlZrAv2mDV-yg6jW3g/o.jpg",
    name: "Molinari Delicatessen",
    itemURL: "yelp.com/biz/molinari-delicatessen-san-francisco",
  },
];

const AddItems: FC<IProps> = observer((props) => {
  const [search, setSearch] = React.useState("");

  const roomId = props.match.params["id"];
  const roomVotingStore = votingStore.room(roomId);
  const groupProfileStore = groupStore.room(roomId);

  // Always do an update when page loads
  useEffect(() => {
    roomVotingStore.updateItems();
    groupProfileStore.update();
  }, []);

  // When search result changes
  useEffect(() => {
    if (search === "") {
      // Show recommendation lsit
    } else {
      // Show searched result
    }
  }, [search]);

  if (groupProfileStore.data == null) return null;

  return (
    <Fragment>
      <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        placeholder={search}
        style={{ marginTop: "15px" }}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {/*{content}*/}
    </Fragment>
  );
});

export default AddItems;
