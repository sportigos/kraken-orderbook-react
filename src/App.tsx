import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import styled from "@emotion/styled";
import TopBar from './components/Topbar';
import PriceTable from './components/PriceTable';
import { PriceItem, SizeBox, PriceList, FeedData } from './interface/commonInterface';
import {
  wssURL,
  msgXBTUSDSub,
  msgETHUSDSub,
  msgXBTUSDUnsub,
  msgETHUSDUnSub,
  ticketOptionsXBT,
  ticketOptionsETH
} from './constant/constant'

const Section = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #242d3c;
`;

const MainPageWrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: #111827;
  margin: 5px 10px;
  padding: 12px 0;
  border-radius: 3px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const MainPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column-reverse;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
  border-radius: 3px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const BottomBar = styled.div`
  height: 64px;
  display: flex;
  margin: 1px 10px 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Button = styled.button`
  outline: none;
  border: none;
  color: white;
  background-color: ${(p) => p.color};
  border-radius: 10px;
  line-height: 23px;
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: bold;
  width: 200px;
  height: 48px;
  margin: 0 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

function App() {
  const [subscribed, setSubscribed] = useState(false);
  const [needUpdate, setNeedUpdate] = useState({ update: true });
  const [ticketFilterdData, setTicketFilterdData] = useState({ bids: {}, asks: {} });
  const [bXBTUSD, setXBTUSD] = useState(true);
  const [ticketSelected, setTicketSelected] = useState(ticketOptionsXBT[0]);
  let websocket = useRef<WebSocket>();
  let orgData = useRef<PriceList>({ bids: {}, asks: {} })
  let updateDataList = useRef<FeedData[]>([]);
  let throwerror = useRef(true)

  const connWebSocket = () => {
    websocket.current = new WebSocket(wssURL);
    websocket.current.onopen = () => {
      console.log("ws opened");
      websocket.current?.send(msgXBTUSDSub);
    }
    websocket.current.onclose = () => {
      console.log("ws closed");
    }
    websocket.current.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
    websocket.current.onmessage = e => {
      const message = JSON.parse(e.data);

      if (message.event === "subscribed")
        setSubscribed(true)
      else if (message.event === "unsubscribed")
        setSubscribed(false)
      else
        funcReceiveData(message);
    };

    return () => {
      websocket.current?.close();
    };
  }

  useEffect(connWebSocket, []);

  useEffect(() => {
    const interval = setInterval(() => { setNeedUpdate({ update: true }) }, 1 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (websocket.current?.readyState === WebSocket.OPEN) {
      if (subscribed === false && bXBTUSD === true)
        websocket.current?.send(msgXBTUSDSub)
      else if (subscribed === false && bXBTUSD === false)
        websocket.current?.send(msgETHUSDSub)
    }
  }, [subscribed, bXBTUSD]);

  useEffect(() => {
    const funcProcData = () => {
      let dataList = [...updateDataList.current]
      updateDataList.current = []

      let newBidsData: PriceItem = { ...orgData.current.bids }
      let newAsksData: PriceItem = { ...orgData.current.asks }

      dataList.forEach((data: FeedData) => {
        data.bids.forEach((item: number[]) => {
          if (item[1] === 0)
            delete newBidsData[item[0].toFixed(2)]
          else
            newBidsData = { ...newBidsData, [item[0].toFixed(2)]: { size: item[1] } }
        })

        data.asks.forEach((item: number[]) => {
          if (item[1] === 0)
            delete newAsksData[item[0].toFixed(2)]
          else
            newAsksData = { ...newAsksData, [item[0].toFixed(2)]: { size: item[1] } }
        })
      })

      orgData.current = { bids: newBidsData, asks: newAsksData }

      let sortfilteredBidsData = funcTicketFilterData(orgData.current.bids)
      let sortfilteredAsksData = funcTicketFilterData(orgData.current.asks)
      setTicketFilterdData({ bids: sortfilteredBidsData, asks: sortfilteredAsksData })
    }

    const funcTicketFilterData = (data: PriceItem) => {
      let newData: PriceItem = {}
      let total = 0

      Object.keys(data).forEach(key => {
        total += (data[key] as SizeBox).size
        let nearestPrice = (Math.floor(parseFloat(key) / ticketSelected.value) * ticketSelected.value).toFixed(2)
        if (newData[nearestPrice] === undefined)
          newData[nearestPrice] = { size: (data[key] as SizeBox).size }
        else
          newData[nearestPrice] = { size: (newData[nearestPrice] as SizeBox).size + (data[key] as SizeBox).size }
      })

      newData = { ...newData, total: total }

      return newData
    }

    funcProcData()

  }, [needUpdate, ticketSelected]);

  const onToggleFeed = () => {
    if (bXBTUSD === true) {
      websocket.current?.send(msgXBTUSDUnsub)
      setTicketSelected(ticketOptionsETH[0]);
    } else {
      websocket.current?.send(msgETHUSDUnSub)
      setTicketSelected(ticketOptionsXBT[0]);
    }

    setXBTUSD(!bXBTUSD)
  }

  const onKillFeed = () => {
    if (throwerror.current === true) {
      websocket.current?.close()
      websocket.current = new WebSocket("wss://www.cryptofacilities.com/wsssss/v1");
      websocket.current.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };

      orgData.current = { bids: {}, asks: {} }
      updateDataList.current = []
    } else {
      connWebSocket()
    }
    throwerror.current = !throwerror.current
  }

  const onTicketSelChange = (selectedOption: any) => {
    setTicketSelected(selectedOption);
  }

  const funcReceiveData = (data: FeedData) => {
    // console.log("e", data);
    if (data.feed === "book_ui_1_snapshot") {
      orgData.current = { bids: {}, asks: {} }
      updateDataList.current = []
    }

    if (data.bids && data.asks) {
      updateDataList.current = [...updateDataList.current, data]
    }

    if (data.feed === "book_ui_1_snapshot") {
      setNeedUpdate({ update: true })
    }
  }

  return (
    <Section>
      <TopBar
        options={bXBTUSD}
        value={ticketSelected}
        onChange={onTicketSelChange}>
      </TopBar>
      <MainPageWrapper>
        <MainPage>
          <PriceTable tbltype="bid" data={ticketFilterdData.bids}></PriceTable>
          <PriceTable tbltype="ask" data={ticketFilterdData.asks}></PriceTable>
        </MainPage>
      </MainPageWrapper>
      <BottomBar>
        <Button color={"#5741d9"} onClick={onToggleFeed}>Toggle Feed</Button>
        <Button color={"#b91d1d"} onClick={onKillFeed}>Kill Feed</Button>
      </BottomBar>
    </Section>
  );
}

export default App;
