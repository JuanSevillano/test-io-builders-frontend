import React, {useEffect, useState } from 'react';
import { useTransition, animated, config } from 'react-spring'


const Notification = ({ isActive, onClose, message, uri }) => {

  const transitions = useTransition(isActive, {
    from: { color: '#60c657', height: '0vh', opacity: 0, background: '#60c657' },
    enter: {  color: '#000000' ,height: '80vh' ,opacity: 1, background: '#bababa' },
    leave: { color: '#60c657',height: '0vh', opacity: 0, background: '#fffff' },
    reverse: isActive,
    delay: 400,
    config: config.molasses,
    onRest: () => onClose(),
  })
  
  return transitions(
    (styles, item) => item && <animated.div style={styles}>
    <p styles={{ color: 'white'}}>
    <a href={uri} target="_blank" > ✌ {message}</a>
    </p>
    </animated.div>
  )
}

export default Notification;