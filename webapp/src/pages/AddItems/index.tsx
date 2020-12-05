/**
 * @desc when user need to add items to the list for voting.
 */

import React, { FC, Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import { groupStore } from "../../stores/group-store";
import TextField from "@material-ui/core/TextField";
import { InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonAdd from "../../components/ButtonAdd";
import { itemStore } from "../../stores/item-store";
import { createDebouncer } from "../../common/utils";
import CheckIcon from "@material-ui/icons/Check";
import VotingButton from "../../components/VotingButton";
import { VotingItem } from "../../domain/voting-item";

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

const searchDebounce = createDebouncer(500);

const AddItems: FC<IProps> = observer((props) => {
  const [term, setTerm_] = useState("");
  const [latitude, setLatitude] = useState(-1);
  const [longitude, setLongitude] = useState(-1);

  const classes = useStyles();
  const roomId = props.match.params["id"];
  const groupProfileStore = groupStore.room(roomId);
  const itemListStore = itemStore.room(roomId);

  // Always do an update when page loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }

    itemListStore.search(term, latitude, longitude);

    groupProfileStore.update();
  }, []);

  if (groupProfileStore.data == null) return null;

  const setTerm = (term: string) => {
    setTerm_(term);
    searchDebounce(() => itemListStore.search(term, latitude, longitude));
  };

  const handleAdd = async (item: VotingItem) => {
    await itemListStore.addItem(item);
    await groupProfileStore.update();
  };

  const addedItems = new Set(groupProfileStore.data.itemList);

  return (
    <Fragment>
      <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
      <div className={classes.screen}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          value={term}
          style={{ marginTop: "15px" }}
          onChange={(e) => setTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <div className={classes.container}>
          {itemListStore.items.map((item) => (
            <div
              key={item.itemId}
              style={{
                backgroundImage: "url(" + item.imgURL + ")",
              }}
              className={classes.card}
            >
              <div className={classes.title}>{item.name}</div>
              <div className={classes.addButton}>
                {addedItems.has(item.itemId) ? (
                  <VotingButton
                    onClick={() => null}
                    icon={CheckIcon}
                    disabled
                  />
                ) : (
                  <ButtonAdd handleAdd={() => handleAdd(item)} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
});

export default AddItems;
