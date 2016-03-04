import React, { PropTypes, Component } from 'react';
import styles from './style.scss';
import withStyles from '../../decorators/withStyles';
import withViewport from '../../decorators/withViewport';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import StarBorder from 'material-ui/lib/svg-icons/toggle/star-border';
import IconButton from 'material-ui/lib/icon-button';
import classNames from 'classnames';
import Header from '../common/Header';
import Footer from '../common/Footer';

const gridStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 400,
    overflowY: 'auto',
    marginBottom: 24,
  },
};
const tilesData = [
  {
    img: 'images/grid-list/00-52-29-429_640.jpg',
    title: 'Breakfast',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/burger-827309_640.jpg',
    title: 'Tasty burger',
    author: 'pashminu',
  },
  {
    img: 'images/grid-list/camera-813814_640.jpg',
    title: 'Camera',
    author: 'Danson67',
  },
  {
    img: 'images/grid-list/morning-819362_640.jpg',
    title: 'Morning',
    author: 'fancycrave1',
  },
  {
    img: 'images/grid-list/hats-829509_640.jpg',
    title: 'Hats',
    author: 'Hans',
  },
  {
    img: 'images/grid-list/honey-823614_640.jpg',
    title: 'Honey',
    author: 'fancycravel',
  },
  {
    img: 'images/grid-list/vegetables-790022_640.jpg',
    title: 'Vegetables',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/water-plant-821293_640.jpg',
    title: 'Water plant',
    author: 'BkrmadtyaKarki',
  },
];


@withViewport
@withStyles(styles)
class Page extends Component {
  constructor (props) {
    super(props);
    this.state = {
      users: []
    };
    this.getUsers();
  }

  getUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          users: json.users
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <div className="UsersPage">
        <Header />
        <div className="container">
          <div style={gridStyles.root}>
            <GridList
              cellHeight={200}
              style={gridStyles.gridList}
              >
              {this.state.users.map(user => (
                <GridTile
                  key={user._id}
                  title={user.githubProfile._json.name}
                  subtitle={<span>{user._id}</span>}
                  actionIcon={<IconButton><StarBorder color="white"/></IconButton>}
                  >
                  <img src={user.githubProfile._json.avatar_url} />
                </GridTile>
              ))}
            </GridList>
          </div>
        </div>
      </div>
    );
  }

}

export default Page;
