import { useState, FormEvent, useEffect } from "react";
import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export interface coinProps {
  changePercent24Hr: string;
  explorer: string;
  id: string;
  marketCapUsd: string;
  maxSupply: string;
  name: string;
  priceUsd: string;
  rank: string;
  supply: string;
  symbol: string;
  volumeUsd24Hr: string;
  vwap24Hr: string;
  formatPrice?: string;
  formatMarket?: string;
  formatVolume?: string;
  update?: number;
}

interface dataProps {
  data: coinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<coinProps[]>([]);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);

  const navegate = useNavigate();

  function hadleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;

    navegate(`/detail/${input.toLowerCase()}`);
  }

  function hadleGetMore() {
    // alert("Carregar limit");
    setLimit(limit + 10);
  }

  useEffect(() => {
    getData();
  }, [limit]);

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=${limit}&offset=0`)
      .then((response) => response.json())
      .then((data: dataProps) => {
        const coinsData = data.data;

        // formatar o preço
        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        // formatar o preço
        const formatData = coinsData.map((item) => {
          const formated = {
            ...item,
            formatPrice: price.format(Number(item.priceUsd)),
            formatMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };

          return formated;
        });

        setCoins(formatData);

        setLoading(false);
      });
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={hadleSubmit}>
        <input
          type="text"
          placeholder="digite o nome da moeda... ex cripto"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.tdLabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.logo}
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                      alt="image cripto"
                    />
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdLabel} data-label="Valor mercado">
                  {item.formatMarket}
                </td>

                <td className={styles.tdLabel} data-label="Preço">
                  {item.formatPrice}
                </td>

                <td className={styles.tdLabel} data-label="Volume">
                  {item.formatVolume}
                </td>

                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLast
                  }
                  data-label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}%</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={hadleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
