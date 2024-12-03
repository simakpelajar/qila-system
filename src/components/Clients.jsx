import { useState } from "react";
import { clients as initialClients } from "../constants";
import styles from "../style";

const Clients = () => {
  const [clientsData, setClientsData] = useState(initialClients);

  const handleClick = (clickedId) => {
    setClientsData(prevClients =>
      prevClients.map(client => ({
        ...client,
        isActive: client.id === clickedId ? !client.isActive : client.isActive
      }))
    );
  };

  return (
    <section className={`${styles.flexCenter} my-4`}>
      <div className={`${styles.flexCenter} flex-wrap w-full`}>
        {clientsData.map((client) => (
          <div 
            key={client.id} 
            className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] m-5 cursor-pointer`}
            onClick={() => handleClick(client.id)}
          >
            <img 
              src={client.logo} 
              alt="client_logo" 
              className={`sm:w-[192px] w-[100px] object-contain transition-all duration-300 ${
                client.isActive ? '' : 'grayscale'
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;
