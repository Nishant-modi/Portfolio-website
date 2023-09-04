import React , {useRef, useMemo, useEffect, useLayoutEffect, useState, Suspense, useCallback, createContext, useContext, Children, cloneElement, forwardRef} from "react";
//import _extends from '@babel/runtime/helpers/esm/extends';
import {StandardReality} from "spacesvr";
import styled from '@emotion/styled';

const EnvironmentContext = /*#__PURE__*/createContext({});
const useEnvironment = () => useContext(EnvironmentContext);
const useEnvironmentState = name => {
  const [menuItems, setMenuItems] = useState([]);
  const container = useRef(null);
  const [paused, setPausedValue] = useState(true);
  const events = useMemo(() => [], []);
  const [played, setPlayed] = useState(false);
  const setPaused = useCallback(p => {
    setPausedValue(p); // hook into paused click event to make sure global context is running.
    // https://github.com/mrdoob/three.js/blob/342946c8392639028da439b6dc0597e58209c696/src/audio/AudioContext.js#L9
    // local state to only do once so we don't interfere with MuteOnHide

    if (!played) {
      const context = AudioContext.getContext();
      if (context.state !== "running") context.resume();
      setPlayed(true);
    } // call all pause events


    events.map(ev => ev.apply(null, [p]));
  }, [events, played]);
  const device = useDevice();
  return { ...device,
    name,
    paused,
    setPaused,
    events,
    containerRef: container,
    menuItems,
    setMenuItems
  };
};




const Container$1 = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transition: opacity 0.25s ease;
  background: rgba(0, 0, 0, ${props => props.dev ? 0 : 0.25});
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  opacity: ${props => props.paused ? 1 : 0};
  pointer-events: ${props => props.paused ? "all" : "none"};
  font-family: sketchnote-text, sans-serif;
  font-style: normal; 
  font-size: 27px;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;
const ClickContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;
const Window = styled.div`
  width: 90%;
  max-width: 400px;
  padding: 20px 20px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  background-color: white;
  background-position: center;
  background-size: cover;
  box-sizing: border-box;

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;
const Continue = styled.div`
  width: 90%;
  max-width: 400px;
  height: auto;
  cursor: pointer;
  text-align: center;
  font-size: 1.3em;
  font-family: rig-solid-bold-fill, sans-serif;
  transition: opacity 0.15s linear;
  margin-top: 20px;
  background: ${props => props.color};
  color: white;
  //border: 2px solid black;
  line-height: 1em;
  padding: 12px 0;
  border-radius: 10px;
  :hover {
    opacity: 0.5;
  }

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;
const Instructions = styled.div`
  width: 100%;
  height: auto;
  margin: 30px 0;
  font-size: 0.7em;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & > p {
    margin: 0.2em;
  }
`;
const MenuButton = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;
const MenuLink = styled.a`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;
  text-decoration: none;
  color: black !important;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;
const Title = styled.h1`
  margin: 0;
`;

const SubTitle = styled.div`
width: 100%;
height: auto;
margin: 30px 0;
font-size: 0.7em;
text-align: center;
display: flex;
flex-direction: column;
justify-content: center;

& > p {
  margin: 0.2em;
}
`;
const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;



function PauseMenu(props) {
    const {
      title = "spacesvr",
      title2 = "jmangoes",
      subTitle = "Game designer, artist, developer",
      pauseMenuItems = [],
      dev = false
    } = props;
    const {
      paused,
      setPaused,
      menuItems,
      device
    } = useEnvironment();
    const layout = useKeyboardLayout();
    const closeOverlay = useCallback(() => {
      const item = menuItems.find(item => item.text === "Enter VR");
      if (item && item.action) item.action();else setPaused(false);
    }, [menuItems, setPaused]);
    //const hex = useMemo(() => new Idea().setFromCreation(Math.random(), 0.8, 0.95).getHex(), []);
    const PAUSE_ITEMS = [...pauseMenuItems, {
      text: "v2.12.2",
      link: "https://www.npmjs.com/package/spacesvr"
    },
    {
      text: "what",
      link: "https://www.npmjs.com/package/spacesvr"
    }, ...menuItems];
    return /*#__PURE__*/React.createElement(Container$1, {
      paused: paused,
      dev: dev
    }, /*#__PURE__*/React.createElement(ClickContainer, {
      onClick: closeOverlay
    }), !dev && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Window, null, /*#__PURE__*/React.createElement(Title, null, title2), /*#__PURE__*/React.createElement(SubTitle, null, subTitle), /*#__PURE__*/React.createElement(Instructions, null, /*#__PURE__*/React.createElement("p", null, "Move \u2013 ", device.mobile ? "Joystick" : layout), /*#__PURE__*/React.createElement("p", null, "Look \u2013 ", device.mobile ? "Drag" : "Mouse"), /*#__PURE__*/React.createElement("p", null, "Pause \u2013 ", device.mobile ? "Menu Button" : "Esc"), /*#__PURE__*/React.createElement("p", null, "Cycle Tool \u2013 ", device.mobile ? "Edge Swipe" : "Tab")), /*#__PURE__*/React.createElement(Actions, null, PAUSE_ITEMS.map(item => item.link ? /*#__PURE__*/React.createElement(MenuLink, {
      key: item.text,
      href: item.link,
      target: "_blank"
    }, item.text) : /*#__PURE__*/React.createElement(MenuButton, {
      key: item.text,
      onClick: item.action
    }, item.text)))), /*#__PURE__*/React.createElement(Continue, {
      onClick: closeOverlay,
      color: hex
    }, "continue")));
  }

  const useKeyboardLayout = () => {
    const [layout, setLayout] = useState("W/A/S/D");
    useEffect(() => {
      const IS_IN_IFRAME = window.self !== window.top;
      if (!navigator.keyboard || IS_IN_IFRAME) return;
      const keyboard = navigator.keyboard;
      keyboard.getLayoutMap().then(keyboardLayoutMap => {
        const upKey = keyboardLayoutMap.get("KeyW");
        if (upKey === "z") setLayout("Z/Q/S/D");
      });
    }, []);
    return layout;
  };

  export{PauseMenu}