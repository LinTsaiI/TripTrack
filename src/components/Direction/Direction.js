import React from 'react';
import { useSelector } from 'react-redux';
import './Direction.css';

const Direction = () => {
  const directionState = useSelector(state => state.direction);
  const directionClassName  = directionState.isOpen ? 'direction-container' : 'display-none';
  return (
    <div className={directionClassName}>
      <div className='direction-top-part'>
        <div className='direction-title'>
          <div className='direction-img'/>
          <div>Direction</div>
        </div>
        <div className='direction-pin-name'>{directionState.start}</div>
        <div className='direction-arrow'>&#8595;</div>
        <div className='direction-pin-name'>{directionState.end}</div>
      </div>
      <div className='direction-choice'>Here embed Google Direction results:{directionState.directionInfo}</div>
    </div>
  )
}

export default Direction;

// Map 右手邊規劃路線視窗

/* 做筆記框框
1. 可由規劃路線視窗點擊切換顯示在相同視窗位置
2. 點擊加入景點清單之單一景點右手邊的Notes圖示，會在地圖上該圖示旁跳出筆記視窗
3. 地圖上該景點圖示，跳出Notes及規劃路線按鈕，點擊Notes按鈕跳出筆記視窗
*/
