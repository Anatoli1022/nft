import classNames from 'classnames/bind';

import styles from './Hero.module.scss';

const cx = classNames.bind(styles);
const Hero = () => {
  return (
    <section className={cx('hero')}>
      <div className={cx('container', 'hero-container')}>
        Для работы с системой вам понадобится установленный MetaMack настроенный
        на сеть сибериум. — Параметры блокчейн-сети Siberium Testnet
        https://chainlist.org/chain/111000 — Блокчейн-обозреватель Siberium
        https://explorer.test.siberium.net/ — Ссылка на наш кран
        https://faucet.test.siberium.net Принцип работы: 1) Лесничества или
        заводы по переработке углерода с помощью нашей системы выпускают токены
        типа erc20 которые могут свободно торговаться на любой бирже. 2)
        Верификаторы как официальные такие как ППК РЭО так и любые другие могут
        посмотреть документы любой группы выпущенных токенов и подтвердить что
        все верно. 3) Потребители заводы или организации могут купить токены и
        использовать их. 4) Обычные пользователи заботящиеся об экологии тоже
        могут покупать эти токены, когда покупают то получают NFT одежду для
        своего аватара. На вкладке эмитент происходит выпуск новых токенов На
        вкладке верификатор - проверка На вкладке потребитель - просмотр
        информации о токене На вкладке поиск токена - список всех выпущенных
        токенов вкладка Профиль - ваш аватар с его одеждой
      </div>
    </section>
  );
};

export default Hero;
