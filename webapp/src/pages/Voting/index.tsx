/**
 * @desc when user need to add items to the list for voting.
 */

import React, {FC, Fragment, useState} from "react";
import Header from "../../components/Header";
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TinderCard from 'react-tinder-card'
import './index.css'

const db = [
  {
    name: 'Ginza Kyubey',
    imgURL: 'https://jw-webmagazine.com/wp-content/uploads/2019/06/jw-5d146db6e10238.04380328.jpeg',
    location: 'Ginza, Tokyo'
  },
  {
    name: 'The MOON',
    imgURL: 'https://lh3.googleusercontent.com/proxy/aPjtJTaEKNXQMQHv6pSgfq94CZXz9DhjrMPUT_KTsAsNW81Ol8JQn6G56tLTCtOSFDPggOW7piw_DjboWGpZC20t7N8gOoC3uHk',
    location: 'Shibuya, Tokyo'
  },
]

const removed: Array<string> = []
let dbState = db


const Voting: FC = () => {
    const [items, setItems] = useState(db)

    const onSwipe = (direction: string, removeItem: string) => {
      console.log('You swiped: ' + direction)

      removed.push(removeItem)
      if (direction === 'right') {
          console.log('Like')
      } else if (direction === 'left') {
          console.log('dislike')
      }
    }

    const onCardLeftScreen = (name: string) => {
        console.log(name + ' left the screen')
        dbState = dbState.filter(item => item.name !== name)
        setItems(dbState)
    }

    return (
        <Fragment>
            <Header hasBackButton buttons={[
                <IconButton> <EditOutlinedIcon/> </IconButton>
            ]}>
                Group Name
            </Header>

            <div className="cardContainer">
                {items.map((item
                    ) =>
                    <div className="swipe">
                        <TinderCard onSwipe={(dir) => onSwipe(dir, item.name)}
                                    onCardLeftScreen={() => onCardLeftScreen(item.name)}
                                    preventSwipe={['up', 'down']}>
                            <div style={{ backgroundImage: 'url(' + item.imgURL + ')' }} className='card'>
                                <h3>{item.name}</h3>
                            </div>
                        </TinderCard>
                    </div>
                )}

            </div>

        </Fragment>
    )
}

export default Voting;