"use strict";
console.log('Module test.js');

import { store } from "/js/store.js";
import { socket } from "/js/socket.js"
import { logger } from "/js/logger.js";

const TEST_CONFIG_LIST_URL = store.state.urls.testConfigList;
const RUN_TEST_CONFIG_URL = store.state.urls.runTestConfig;
const TEST_CONFIG_LIST_ELEMENT = 'test-config-list';

const wsListener = {name:'test.js'};

function testStarted(wsMessage) {
    const msgArr = wsMessage.split(":");
    let testRunId = "test-run-id-" + msgArr[1];
    let testName = decodeURI(msgArr[2]);
    let xpath = "//a[text()='" + testName + "']";
    let el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(el == null) return;
    el.innerHTML += '<div id="' + testRunId +'" class="lds-dual-ring"></div>';
}

function testFinished(wsMessage) {
    const msgArr = wsMessage.split(":");
    let testRunId = "test-run-id-" + msgArr[1];
    let testName = decodeURI(msgArr[2]);

    let el = document.getElementById(`${testRunId}`);
    if(el) el.remove();
}

function runTestConfig (testConfig) {
    let params = "?"
    if(testConfig) params += "testConfigFileName=" + testConfig + "&";

    let sessionId = store.state.session.id;
    console.log(store)
    if(sessionId) params += "sessionId=" + sessionId;
    console.log('[test.runTestConfig()] params: ' + params);
    fetch(RUN_TEST_CONFIG_URL + encodeURI(params));
}

function testList(tests) {
    const testArr = tests.split(/\r?\n/);
    store.state.testConfigs = testArr;
    render();
}

function onMessage (event) {
    let message = event.data;
    if(!message) return;

    if(message.includes("testStarted")) testStarted(message);
    if(message.includes("testFinished")) testFinished(message);
}

function render() {
  let testConfigs = store.state.testConfigs;
  if(testConfigs && testConfigs.length > 0) {
    let list = '';
    for(let i = 0; i < testConfigs.length; i++) {
        let item = encodeURI(testConfigs[i]);
        list += '<li><a href="#tests" onclick="app.runTestConfig(\'' + item + '\'); return false;">' + testConfigs[i] + '</a></li>';
    }
    let el = document.getElementById(TEST_CONFIG_LIST_ELEMENT);
    if(el) el.innerHTML = list;
    window.app.runTestConfig = runTestConfig;
  }
}

function onMount() {
    render();
    logger.onMount();
    logger.printLogOnce();
}

function init() {
    wsListener.onmessage = onMessage;
    socket.subscribe(wsListener);

    fetch(TEST_CONFIG_LIST_URL)
      .then(response => response.text())
      .then(text => {
           testList(text);
      });
}

init();

export { onMount }


