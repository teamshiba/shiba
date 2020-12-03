/**
 * @desc when user need to add items to the list for voting.
 */

import React, { FC, Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import { groupStore } from "../../stores/group-store";
import TextField from "@material-ui/core/TextField";
import { VotingItem } from "../../domain/voting-item";
import { InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonAdd from "../../components/ButtonAdd";
import { itemStore } from "../../stores/item-store";

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

const AddItems: FC<IProps> = observer((props) => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [itemList, setItemList] = useState<VotingItem[]>([]);

  const roomId = props.match.params["id"];
  const groupProfileStore = groupStore.room(roomId);
  const itemListStore = itemStore.room(roomId);

  // Always do an update when page loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        itemListStore.updateRecommendedItems(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      itemListStore.updateRecommendedItems(-1, -1);
    }

    itemListStore.updateSearchedItems();
    groupProfileStore.update();
  }, []);

  // When search result changes
  useEffect(() => {
    // Delay search for 1 second
    const timer = setTimeout(() => {
      if (search === "") {
        // Show recommendation list
        setItemList(Array.from(itemListStore.itemsRecommended.values()));
      } else {
        // Show searched list
        setItemList(Array.from(itemListStore.itemsSearched.values()));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  if (groupProfileStore.data == null) return null;

  const handleAdd = async (item: VotingItem, isSearch: boolean) => {
    await itemListStore.addItem(item);
    await itemListStore.removeItemFromList(item, isSearch);
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
                <ButtonAdd
                  handleAdd={() => handleAdd(item, search.length === 0)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
});

export default AddItems;
