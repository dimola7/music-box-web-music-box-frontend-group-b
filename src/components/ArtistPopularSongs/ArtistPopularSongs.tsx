import React from 'react';
import popularSongs from './ArtistPopularSongs.module.css';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useMusicPlayer from '../../hooks/useMusicPlayer';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import AddToPlaylist from '../PlaylistModal/PlaylistModal';

interface Props {
  tracks: any[];
}

const getTimeFormat = (sec: number): string => {
  const date = new Date(0);
  date.setSeconds(sec);
  const timeString = date.toISOString().substr(14, 5);
  return timeString;
};

const ArtistPopularSongs: React.FC<Props> = (props) => {
  const { setPlaylistModal, setSongToAdd } = useContext(AuthContext);
  const { handleSongClick } = useMusicPlayer();

  const addToPlaylist = (track: any, e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    console.log("****HELO")
    setSongToAdd({
      album: track.album.title,
      albumImgUrl: track.album.cover_small,
      preview: track.preview,
      duration: +track.duration,
      title: track.title,
      id: track.id,
      artist: track.artist.name,
    });
    setPlaylistModal(true);
  };

  return (
    <div className={popularSongs.popularBody}>
      <div className={popularSongs.grid}>
        <div>
          <p>Popular songs</p>
        </div>
        <div className={popularSongs.right}>
          <KeyboardArrowDownIcon />
        </div>
      </div>
      <table className={popularSongs.popularTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {props.tracks.map((track, index) => (
            <tr key={track.id}>
              <td>{index + 1}</td>
              <td className={popularSongs.trackTitle} onClick = {() => handleSongClick(track.id, props.tracks)}>
                <span className={popularSongs.singleGenreCard}>
                  <img src={track.album.cover_small} alt='' />
                </span>
                <span>{track.title}</span>
              </td>
              <td>{track.artist.name}</td>
              <td>{track.album.title}</td>
              <td>{getTimeFormat(track.duration)}</td>
              <td>
                <span onClick={(e) => addToPlaylist(track, e)}>
                  <AddIcon className={popularSongs.add} style={{ fontSize: 'medium', float: 'right' }} />
                </span>
                <span>
                  <MoreVertIcon className={popularSongs.dots} style={{ fontSize: 'medium', float: 'right' }} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddToPlaylist />
    </div>
  );
};

export default ArtistPopularSongs;
