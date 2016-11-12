import React from 'react';

import Debug from 'debug';

var debug = Debug('itaigi:HapSing');

export default class HapSing extends React.Component {

  componentDidMount()
  {
    setTimeout(this.載入.bind(this), Math.random() * 1000);
  }

  componentDidUpdate(prevProps,  prevState)
  {
    setTimeout(this.載入.bind(this), Math.random() * 1000);
  }

  載入() {
    let 音樂 = this.refs.音樂;
    if (音樂 != null)
      音樂.load();
  }

  play() {
    let 音樂 = this.refs.音樂;
    if (音樂 != null) {
      音樂.play();
    }
  }

  render() {
    let { 音標 } = this.props;
    let 標漢字音標 = (
      音標
      .replace('/', ' 。 ').trim()
    );
    return (
      <div className='HuatIm'>
        <audio ref="音樂">
          <source type='audio/wav'
            src={
              encodeURI('http://voice.itaigi.tw/文本直接合成?查詢腔口=閩南語&查詢語句=' + 標漢字音標) }
           />
        </audio>
        <button onClick={this.play.bind(this)}
          className='ui compact icon button'>
          <i className='icon play'></i>
        </button>
      </div>
    );
  }
};

