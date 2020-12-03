/**
 * @desc when user need to add items to the list for voting.
 */

import React, { FC, Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import { votingStore } from "../../stores/voting-store";
import { groupStore } from "../../stores/group-store";
import TextField from "@material-ui/core/TextField";
import { VotingItem } from "../../domain/voting-item";
import { InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonAdd from "../../components/ButtonAdd";

type IProps = RouteComponentProps<{ id: string }>;

const useStyles = makeStyles(() => ({
  screen: {
    height: "85vh",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    overflowY: "scroll",
    paddingBotton: "40px",
  },
  card: {
    width: "150px",
    height: "210px",
    position: "relative",
    borderRadius: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginTop: "2em",
  },
  title: {
    margin: "3px",
    position: "absolute",
    bottom: 0,
    color: "white",
    fontWeight: 700,
  },
  addButton: {
    margin: "5px",
    float: "right",
  },
}));

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
    itemId: "2north-india-restaurant-san-francisco",
    imgURL:
      "https://s3-media1.fl.yelpcdn.com/bphoto/howYvOKNPXU9A5KUahEXLA/o.jpg",
    name: "2North India Restaurant",
    itemURL: "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
  },
  {
    itemId: "2molinari-delicatessen-san-francisco",
    imgURL:
      "http://s3-media4.fl.yelpcdn.com/bphoto/6He-NlZrAv2mDV-yg6jW3g/o.jpg",
    name: "2Molinari Delicatessen",
    itemURL: "yelp.com/biz/molinari-delicatessen-san-francisco",
  },
];

const AddItems: FC<IProps> = observer((props) => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [itemList, setItemList] = useState<VotingItem[]>([]);

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
      // Show recommendation list
      setItemList(fakeRecItems);
    } else {
      // Show searched list
      setItemList(fakeItems);
    }
  }, [search]);

  if (groupProfileStore.data == null) return null;

  const handleAdd = async (item: VotingItem) => {
    await roomVotingStore.addItem(item);
    await roomVotingStore.updateItems();
    setItemList(
      itemList.filter((filterItem) => filterItem.itemId !== item.itemId)
    );
  };

  return (
    <Fragment>
      <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
      <div className={classes.screen}>
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

        <div className={classes.container}>
          {itemList.map((item) => (
            <div
              key={item.itemId}
              style={{
                backgroundImage: "url(" + item.imgURL + ")",
              }}
              className={classes.card}
            >
              <div className={classes.title}>{item.name}</div>
              <div className={classes.addButton}>
                <ButtonAdd handleAdd={() => handleAdd(item)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
});

export default AddItems;
