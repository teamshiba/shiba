/**
 * @desc when user need to add items to the list for voting.
 */

import React, { FC, Fragment, useEffect } from "react";
import Header from "../../components/Header";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import { votingStore } from "../../stores/voting-store";
import { groupStore } from "../../stores/group-store";
import IconButton from "@material-ui/core/IconButton";
import { browserHistory } from "../../common/utils";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

type IProps = RouteComponentProps<{ id: string }>;

const AddItems: FC<IProps> = observer((props) => {
  const roomId = props.match.params["id"];
  const roomVotingStore = votingStore.room(roomId);
  const groupProfileStore = groupStore.room(roomId);

  // Always do an update when page loads
  useEffect(() => {
    roomVotingStore.updateItems();
    groupProfileStore.update();
  }, []);

  if (groupProfileStore.data == null) return null;

  return (
    <Fragment>
      <Header hasBackButton>{groupProfileStore.data.roomName}</Header>
      {/*{content}*/}
    </Fragment>
  );
});

export default AddItems;
