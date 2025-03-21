import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coinProps } from "../home/Home";
import styles from "./detail.module.css";

interface ResponseProps {
  data: coinProps;
}

interface ErrorProps {
  error: string;
}

type DataProps = ResponseProps | ErrorProps;

export function Detail() {
  const navegate = useNavigate();
  const { cripto } = useParams();
  const [coin, setCoin] = useState<coinProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navegate("/");
              return;
            }

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

            const resultData = {
              ...data.data,
              formatPrice: price.format(Number(data.data.priceUsd)),
              formatMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
            console.log(coin);
            setLoading(false);
          });
      } catch (err) {
        console.log(err);
        navegate("/");
      }
    }

    getCoin();
  }, [cripto]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <h1>Loading....</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${String(
            coin?.symbol
          ).toLowerCase()}@2x.png`}
          alt="Logo da moeda"
          className={styles.logo}
        />

        <h1>
          {coin?.name} | {coin?.symbol}
        </h1>

        <p>
          <strong>Preço:</strong> {coin?.formatPrice}
        </p>

        <a>
          <strong>Mercado:</strong> {coin?.formatMarket}
        </a>

        <a>
          <strong>Volume:</strong> {coin?.formatVolume}
        </a>

        <a>
          <strong>Mudança 24h:</strong>{" "}
          <span
            className={
              Number(coin?.changePercent24Hr) > 0
                ? styles.tdProfit
                : styles.tdLast
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(3)}
          </span>
        </a>
      </section>
    </div>
  );
}
