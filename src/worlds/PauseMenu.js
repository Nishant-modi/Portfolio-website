import React from "react";
import _extends from '@babel/runtime/helpers/esm/extends';
import "spacesvr";


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
    const hex = useMemo(() => new Idea().setFromCreation(Math.random(), 0.8, 0.95).getHex(), []);
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