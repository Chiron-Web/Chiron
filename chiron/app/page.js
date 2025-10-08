'use client';
import Homepage from "./components/homepage";
import { store } from "./redux/store";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}> 
      <main>
        <Homepage />
      </main>
    </Provider>
  );
}
