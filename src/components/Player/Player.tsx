/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import Queue from './Queue/Queue';
import Slider from './Slider/Slider';
import FullScreenPlayer from './FullScreenPlayer/FullScreenPlayer';
import styles from './Player.module.scss';
import thumbnail from '../../assets/img-thumbnail.svg';
import {
  MdFavoriteBorder,
  MdAdd,
  MdVolumeOff,
  MdSkipPrevious,
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdRepeat,
} from 'react-icons/md';
import { BiShuffle } from 'react-icons/bi';
import { BsVolumeUpFill } from 'react-icons/bs';
import { AiOutlineMenuUnfold } from 'react-icons/ai';

import useMusicPlayer from '../../hooks/useMusicPlayer';

interface Props {}
const Player = (props: Props) => {
  const {
    playing,
    setPlaying,
    currentSong,
    getTimeFormat,
    toggleMusicPlay,
    currentSongArray,
    trackIndex,
    handleSongClick,
    shuffle,
    handleShuffle,
    audio,
    originalSongArray,
  } = useMusicPlayer();
  const [duration, setDuration] = useState('00:30');
  const [openQueue, setOpenQueue] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const isReady = useRef(false);
  const intervalRef = useRef(null as any);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [likedSongs, setLikedSongs] = useState([] as number[]);

  useEffect(() => {
    if (audio.current) {
      const songLength = audio.current.duration ? getTimeFormat(Number(audio.current.duration)) : '00:30';
      setDuration(songLength);
    }
  }, [audio, audio.current?.currentTime, audio.current?.duration, getTimeFormat]);
  useEffect(() => {
    if (playing) {
      audio.current.play();
      startTimer();
    } else {
      audio.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (currentSong) {
      if (audio.current.src !== currentSong.preview) {
        audio.current.pause();
        audio.current.src = currentSong.preview;
        if (isReady.current) {
          audio.current.play();
          startTimer();
          localStorage.setItem('song', JSON.stringify(currentSong));
          localStorage.setItem('songArray', JSON.stringify(currentSongArray));
          localStorage.setItem('originalSongArray', JSON.stringify(originalSongArray));
          localStorage.setItem('index', JSON.stringify(trackIndex));
        } else {
          isReady.current = true;
        }
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const allLiked = localStorage.getItem('likedSongs');
    if (allLiked) setLikedSongs(JSON.parse(allLiked));
  }, []);
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  const handleLike = () => {
    const id = currentSong?.id;
    if (id) {
      if (!likedSongs.includes(id)) {
        likedSongs.push(id);
        setLikedSongs(likedSongs);
      } else {
        let newLikedSongs = likedSongs.filter((songId) => songId !== id);
        setLikedSongs(newLikedSongs);
      }
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }
  };
  const toggleShow = () => setShowFullScreen(!showFullScreen);
  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audio.current.ended) {
        playNext();
      } else {
        setProgress(audio.current.currentTime);
        setProgress((100 / audio.current?.duration) * +audio.current?.currentTime);
      }
    }, 900);
  };
  const onScrub = (value: number) => {
    // Clear any timers already running
    // clearInterval(intervalRef.current);
    audio.current.currentTime = value * audio.current.duration;
    setProgress((100 / audio.current?.duration) * +audio.current?.currentTime);
  };

  const playNext = () => {
    if (!currentSong?.preview) return;

    if (repeat) {
      audio.current.currentTime = 0;
      return;
    }
    setPlaying(!playing);
    const newIndex = (trackIndex + 1) % currentSongArray.length;
    handleSongClick(currentSongArray[newIndex].id, currentSongArray);
  };

  const playPrev = () => {
    if (!currentSong?.preview) return;
    audio.current.pause();
    const newIndex =
      (((trackIndex + -1) % currentSongArray.length) + currentSongArray.length) % currentSongArray.length;
    handleSongClick(currentSongArray[newIndex].id, currentSongArray);
  };

  const handleVolumeChange = (value: number) => {
    if (audio.current) {
      audio.current.volume = value;
    }
  };

  const toggleVolume = () => {
    if (audio.current) {
      const initialVolume = audio.current.volume;
      if (initialVolume > 0) {
        audio.current.volume = 0;
      } else {
        audio.current.volume = 1;
      }
    }
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const onProgress = () => {
    if (audio.current) setProgress((100 / audio.current.duration) * +audio.current.currentTime);
  };
  const MobilePlayer = (props: Props) => {
    return (
      <div className={styles.MobilePlayer} style={{ display: showFullScreen ? 'none' : '' }}>
        <div className={styles.info} onClick={toggleShow}>
          <img src={thumbnail} alt='' />
          <h4>
            {currentSong?.title} - {currentSong?.artist?.name}
          </h4>
        </div>

        <div className={styles.controls}>
          <div className={styles.shuffle} onClick={handleShuffle}>
            <BiShuffle style={{ color: shuffle ? '#2dceef' : '' }} />
          </div>
          <div className={styles.prev} onClick={playPrev}>
            <MdSkipPrevious />
          </div>
          <div className={styles.play} onClick={toggleMusicPlay}>
            {!playing ? <MdPlayArrow /> : <MdPause />}
          </div>
          <div className={styles.next} onClick={playNext}>
            <MdSkipNext />
          </div>
          <div onClick={toggleRepeat} className={!repeat ? styles.repeat : [styles.repeat, styles.active].join(' ')}>
            <MdRepeat />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <MobilePlayer />
      <FullScreenPlayer
        likedSongs={likedSongs}
        likeClick={handleLike}
        onScrub={onScrub}
        shuffle={shuffle}
        handleShuffle={handleShuffle}
        currentTime={getTimeFormat(audio.current.currentTime)}
        duration={duration}
        progress={progress}
        handleProgress={onProgress}
        toggleShow={toggleShow}
        show={showFullScreen}
        toggleRepeat={toggleRepeat}
        handleVolumeChange={handleVolumeChange}
        playNext={playNext}
        playPrev={playPrev}
      />
      {openQueue && (
        <Queue
          likedSongs={likedSongs}
          likeClick={handleLike}
          shuffle={shuffle}
          handleShuffle={handleShuffle}
          close={() => setOpenQueue(false)}
        />
      )}
      <div className={styles.Player} style={{ display: showFullScreen ? 'none' : '' }}>
        <div className={styles.left}>
          <div className={styles.thumbnail} onClick={toggleShow}>
            <img src={thumbnail} alt='' />
          </div>
          <div className={styles.info} onClick={toggleShow}>
            <h3>{currentSong?.title}</h3>
            <h4>{currentSong?.artist?.name}</h4>
          </div>
          <div className={styles.fav}>
            <MdFavoriteBorder
              onClick={handleLike}
              fill={currentSong && likedSongs.includes(currentSong.id) ? 'red' : 'white'}
            />
          </div>
          <div className={styles.add}>
            <MdAdd />
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.controls}>
            <div
              className={!shuffle ? styles.shuffle : [styles.shuffle, styles.active].join(' ')}
              onClick={handleShuffle}
            >
              <BiShuffle />
            </div>
            <div className={styles.prev} onClick={playPrev}>
              <MdSkipPrevious />
            </div>
            <div className={styles.play} onClick={() => toggleMusicPlay()}>
              {!playing ? <MdPlayArrow /> : <MdPause />}
            </div>
            <div className={styles.next} onClick={playNext}>
              <MdSkipNext />
            </div>
            <div onClick={toggleRepeat} className={!repeat ? styles.repeat : [styles.repeat, styles.active].join(' ')}>
              <MdRepeat />
            </div>
          </div>
          <div className={[styles.progress, 'slider'].join(' ')}>
            <p style={{ marginRight: 15 }}>{getTimeFormat(audio.current.currentTime)}</p>
            <Slider onScrub={onScrub} value={progress} handleChange={onScrub} />
            <p style={{ marginLeft: 15 }}>{duration}</p>
          </div>
        </div>
        <div className={styles.right}>
          <div
            className={styles.playing}
            style={{ color: openQueue ? '#2DCEEF' : '#FFF' }}
            onClick={() => (currentSongArray.length === 0 ? null : setOpenQueue(!openQueue))}
          >
            <AiOutlineMenuUnfold />
          </div>
          <div className={styles.speaker} onClick={toggleVolume}>
            {audio.current && audio.current.volume > 0 ? <BsVolumeUpFill /> : <MdVolumeOff />}
          </div>
          <div className={styles.volume}>
            <input
              type='range'
              min='0'
              max='1'
              value={audio.current?.volume}
              step='0.01'
              onChange={(e) => handleVolumeChange(Number(e.target.value) as number)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
