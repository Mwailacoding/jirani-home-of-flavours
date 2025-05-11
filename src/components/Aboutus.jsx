import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaLeaf, FaHeart, FaAward, FaShippingFast, FaUsers, FaUtensils, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const AboutUsContainer = styled.section`
  background: linear-gradient(135deg, #f8f4e5 0%, #fff9e6 100%);
  padding: 5rem 2rem;
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover;
    opacity: 0.08;
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextContent = styled.div`
  animation: ${fadeIn} 0.8s ease-out forwards;
  
  h2 {
    font-size: 2.8rem;
    color: #e63946;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
    font-weight: 700;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60%;
      height: 4px;
      background: #f4a261;
      border-radius: 2px;
    }
  }
  
  p {
    color: #333;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    opacity: 0;
    animation: ${fadeIn} 0.8s ease-out forwards;
    
    &:nth-child(2) { animation-delay: 0.3s; }
    &:nth-child(3) { animation-delay: 0.5s; }
    &:nth-child(4) { animation-delay: 0.7s; }
  }
`;

const HighlightCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.05);
  border-left: 5px solid #e63946;
  transform: translateY(20px);
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 0.9s forwards;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
  
  h3 {
    color: #2a9d8f;
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.8rem 0;
      position: relative;
      padding-left: 2.5rem;
      font-size: 1.05rem;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      
      &:last-child {
        border-bottom: none;
      }
      
      svg {
        color: #2a9d8f;
        font-size: 1.2rem;
      }
    }
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0;
    
    &:nth-child(1) {
      height: 250px;
      grid-column: span 2;
      animation: ${fadeIn} 0.8s ease-out 1.1s forwards;
    }
    
    &:nth-child(2) {
      animation: ${fadeIn} 0.8s ease-out 1.3s forwards;
    }
    
    &:nth-child(3) {
      animation: ${fadeIn} 0.8s ease-out 1.5s forwards;
    }
    
    &:hover {
      transform: scale(1.03);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
  }
`;

const VideoContainer = styled.div`
  position: relative;
  grid-column: span 2;
  margin-top: 1rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 1.1s forwards;
  background: #000;
  
  video {
    width: 100%;
    display: block;
    transition: opacity 0.3s ease;
    opacity: ${props => props.$isHovered ? 0.9 : 1};
  }
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.$isPlaying ? 'transparent' : 'rgba(0,0,0,0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background: ${props => props.$isPlaying ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)'};
    
    .play-icon {
      transform: scale(1.1);
    }
  }
  
  .play-icon {
    color: white;
    font-size: 4rem;
    opacity: ${props => props.$isPlaying ? 0 : 0.8};
    transition: all 0.3s ease;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    padding: 1rem;
    display: ${props => props.$isPlaying ? 'none' : 'flex'};
  }
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 3;
  opacity: ${props => props.$isHovered ? 1 : 0};
  transition: opacity 0.3s ease;
  
  button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    
    &:hover {
      color: #f4a261;
      transform: scale(1.1);
    }
  }
  
  .progress-bar {
    flex-grow: 1;
    height: 5px;
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
    position: relative;
    cursor: pointer;
    
    &:hover {
      height: 8px;
    }
    
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #f4a261;
      border-radius: 3px;
    }
    
    .buffered {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
    }
  }
  
  .time {
    color: white;
    font-size: 0.9rem;
    min-width: 80px;
    text-align: center;
  }
  
  .volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100px;
    
    input {
      width: 100%;
      cursor: pointer;
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 1.7s forwards;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    animation: ${pulse} 1.5s infinite;
  }
  
  h4 {
    font-size: 2.5rem;
    color: #e63946;
    margin: 0.5rem 0;
    font-weight: 700;
  }
  
  p {
    color: #555;
    margin: 0;
    font-size: 0.95rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  img {
    max-width: 80%;
    max-height: 80%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  
  button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: #e63946;
    color: white;
    border: none;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: rotate(90deg);
      background: #c1121f;
    }
  }
`;

const AboutUs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [stats, setStats] = useState([
    { value: 0, label: 'Happy Customers' },
    { value: 0, label: 'Products Available' },
    { value: 0, label: 'Years Serving You' }
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const openModal = (imgSrc) => {
    setCurrentImage(imgSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  useEffect(() => {
    // Autoplay the video when component mounts
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.log("Autoplay prevented:", error));
    }

    const video = videoRef.current;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('progress', updateBuffered);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('durationchange', updateDuration);
      video.removeEventListener('progress', updateBuffered);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    // Animate stats counting up
    const targetValues = [8500, 1200, 8];
    const duration = 2000;
    const increment = targetValues.map(val => val / (duration / 16));
    
    let currentValues = [0, 0, 0];
    let startTime = null;
    
    const animateStats = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        currentValues = currentValues.map((val, i) => {
          const newVal = val + increment[i];
          return newVal > targetValues[i] ? targetValues[i] : newVal;
        });
        
        setStats([
          { value: Math.floor(currentValues[0]), label: 'Happy Customers' },
          { value: Math.floor(currentValues[1]), label: 'Products Available' },
          { value: Math.floor(currentValues[2]), label: 'Years Serving You' }
        ]);
        
        requestAnimationFrame(animateStats);
      } else {
        setStats([
          { value: targetValues[0], label: 'Happy Customers' },
          { value: targetValues[1], label: 'Products Available' },
          { value: targetValues[2], label: 'Years Serving You' }
        ]);
      }
    };
    
    requestAnimationFrame(animateStats);
  }, []);

  const images = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ];

  return (
    <AboutUsContainer id="about">
      <ContentWrapper>
        <TextContent>
          <h2>Our Story</h2>
          <p>Founded in 2015, Jirani's Home of Flavors began as a small neighborhood store with a big dream - to bring authentic, fresh, and flavorful ingredients to every home in our community.</p>
          <p>Today, we've grown into a beloved local institution, known for our carefully curated selection of premium groceries, organic produce, and hard-to-find international ingredients that help you create memorable meals.</p>
          <p>Our name "Jirani" means "neighbor" in Swahili, reflecting our commitment to building relationships and serving our community with warmth and integrity.</p>
        </TextContent>
        
        <div>
          <HighlightCard>
            <h3><FaHeart /> Why Choose Us</h3>
            <ul>
              <li><FaLeaf /> Locally-sourced fresh produce</li>
              <li><FaAward /> Ethically-sourced international ingredients</li>
              <li><FaUsers /> Knowledgeable, friendly staff</li>
              <li><FaHeart /> Weekly specials and loyalty rewards</li>
              <li><FaUtensils /> Community cooking classes</li>
              <li><FaShippingFast /> Same-day home delivery</li>
            </ul>
          </HighlightCard>
          
          <ImageGallery>
            <VideoContainer 
              $isHovered={isHovered}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <video
                ref={videoRef}
                poster="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                onClick={togglePlayPause}
                autoPlay
                muted={isMuted}
                loop
              >
                <source src="https://www.youtube.com/watch?v=xPPLbEFbCAo" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <VideoOverlay 
                onClick={togglePlayPause}
                $isPlaying={isPlaying}
              >
                <div className="play-icon">
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </div>
              </VideoOverlay>
              
              <VideoControls $isHovered={isHovered || !isPlaying}>
                <button onClick={togglePlayPause}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                
                <div className="progress-bar" onClick={handleProgressClick}>
                  <div className="buffered" style={{ width: `${(buffered / duration) * 100}%` }}></div>
                  <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>
                
                <div className="time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                <div className="volume-control">
                  <button onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
                
                <button onClick={handleFullscreen}>
                  <FaExpand />
                </button>
              </VideoControls>
            </VideoContainer>
            
            {images.slice(1).map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Gallery ${index + 1}`}
                onClick={() => openModal(img)}
                loading="lazy"
              />
            ))}
          </ImageGallery>
          
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <h4>{stat.value.toLocaleString()}+</h4>
                <p>{stat.label}</p>
              </StatItem>
            ))}
          </StatsContainer>
        </div>
      </ContentWrapper>
      
      <Modal $isOpen={modalOpen}>
        <button onClick={closeModal} aria-label="Close modal">×</button>
        <img src={currentImage} alt="Enlarged view" />
      </Modal>
    </AboutUsContainer>
  );
};

export default AboutUs;