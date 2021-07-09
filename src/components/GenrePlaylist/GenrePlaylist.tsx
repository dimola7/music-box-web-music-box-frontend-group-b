import React, { useContext } from 'react';
import genrePlaylist from './GenrePlaylist.module.css';
import { FcLike } from 'react-icons/fc';
import { BsFillPlusCircleFill } from 'react-icons/bs';
// import { IoIosMusicalNotes } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import Modal from '../../ui/Modal/Modal';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import CustomizedAlerts from '../../ui/Alert/Alert';
import BackdropRoller from '../../ui/Backdrop/Backdrop';

interface Props {
  playlists: any[];
  showHidden: (a: string) => void;
}

// const formatTime = (arr: Arr[]) => {
//   const dur = arr.reduce((a, b) => a + Number(b.duration), 0);
//   const result = secondsToHms(dur);
//   return result;
// };

const GenrePlaylist: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertType, setAlertType] = React.useState('success');
  const [alertMsg, setAlertMsg] = React.useState('');
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const ctx = useContext(AuthContext);
  const { token } = ctx.user;

  const URL = 'https://music-box-b.herokuapp.com/api/v1/music-box-api';

  const openHandler = () => {
    setOpen(true);
  };

  const closeAlert = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addData = async (data: Record<string, any>) => {
    setOpenBackdrop(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`${URL}/playlist`, data, config);
      setOpenBackdrop(false);
      setAlertMsg('Playlist added successfully');
      setAlertType('success');
      setOpenAlert(true);
    } catch (error) {
      console.log(error.response.data.message);
      setOpenBackdrop(false);
    }
  };

  // const fetchData = useCallback(async () => {
  //   const loadData = [];

  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   const response = await axios.get(`${URL}/playlist`, config);
  //   const privateRes = await axios.get(`${URL}/playlist/created`, config);
  //   const isPublic = privateRes.data.data.payload.filter((p: Record<string, any>) => !p.isPublic);
  //   const { payload } = response.data.data;
  //   payload.push(...isPublic);

  //   for (const key in payload) {
  //     // const typeOfPlaylist = payload[key].ownerId === res.data.data._id ? 'owner' : 'liked'
  //     const owner = payload[key].ownerId === _id;
  //     const liked = payload[key].likes.includes(_id);
  //     const desc =
  //       payload[key].tracks.length > 1 ? payload[key].tracks.length + ' songs ' : payload[key].tracks.length + ' song ';
  //     if (owner || liked) {
  //       loadData.push({
  //         id: payload[key]._id,
  //         desc: desc + ' ' + formatTime(payload[key].tracks),
  //         name: payload[key].name,
  //         updatedAt: payload[key].updatedAt,
  //         type: owner ? 'owner' : 'liked',
  //         image: payload[key].imgURL,
  //         noOfTracks: !!payload[key].tracks.length,
  //       });
  //     }
  //   }

  //   setPlaylists(loadData);
  // }, [_id, token]);

  // useEffect(() => {
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <div>
      <div className={genrePlaylist.section}>
        <h4 className={genrePlaylist.left}>Playlists</h4>
        <p className={genrePlaylist.right} onClick={() => props.showHidden('playlists')}>
          view all
        </p>
      </div>
      <div className={genrePlaylist.playlistFlex}>
        {props.playlists.length ? (
          props.playlists.slice(0, 7).map((playlist) => {
            return (
              <Link to={`/playlist/${playlist._id}`} className={genrePlaylist.playlistLink}>
                <div key={playlist._id} className={genrePlaylist.playlistDiv}>
                  <img src={playlist.imgURL} className={genrePlaylist.playlistImage} alt='' />
                  <div className={genrePlaylist.playlistName}>{playlist.name}</div>
                  <div className={genrePlaylist.playlistLikes}>
                    <FcLike /> {playlist.likes.length}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={genrePlaylist.noPlaylistDiv}>
            <div className={genrePlaylist.noPlaylistCard}>
              <div>
                <IconContext.Provider value={{ color: '#2DCEEF', size: '30px' }}>
                  <BsFillPlusCircleFill onClick={openHandler} />
                </IconContext.Provider>
              </div>
              <div>Create Playlist</div>
            </div>
          </div>
        )}
      </div>
      <Modal onAddPlaylist={addData} onOpen={open} onHandleClose={handleClose} />
      <CustomizedAlerts
        open={openAlert}
        alertType={alertType as 'success' | 'error'}
        alertMsg={alertMsg}
        onClose={closeAlert}
      />
      <BackdropRoller open={openBackdrop} />
    </div>
  );
};

export default GenrePlaylist;
