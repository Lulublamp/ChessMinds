import React from 'react';
import './friend.css';


//TODO: changer svg suivant si connecté ou non

function Friend(props) {
    const { friend } = props;
    return (
        <div className="friend" key={friend.id}>
            <div>
                <span></span>
                <div>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.134766 0.431396H43.1348V43.4314H0.134766V0.431396ZM9.98893 32.3499C9.98893 32.6545 10.04 32.9546 10.1376 33.2377C7.16703 30.2249 5.50415 26.1624 5.50977 21.9314C5.50977 13.0259 12.7293 5.8064 21.6348 5.8064C30.5402 5.8064 37.7598 13.0259 37.7598 21.9314C37.7655 26.169 36.0974 30.2374 33.1185 33.2511C33.2586 32.8684 33.3095 32.4588 33.2674 32.0534C33.2253 31.648 33.0913 31.2576 32.8755 30.9119C32.6596 30.5661 32.3678 30.2742 32.0221 30.0583C31.6764 29.8424 31.286 29.7082 30.8807 29.666C23.9308 28.9467 19.3817 28.8777 12.3978 29.6499C11.7343 29.7247 11.1216 30.0416 10.6771 30.5399C10.2326 31.0383 9.9876 31.6822 9.98893 32.3499ZM3.7181 21.9314C3.7181 31.5813 11.3479 39.4503 20.9038 39.8337C21.106 39.8449 21.3086 39.8494 21.5111 39.8472L21.6348 39.8481C31.5301 39.8481 39.5514 31.8268 39.5514 21.9314C39.5514 12.036 31.5301 4.01473 21.6348 4.01473C11.7394 4.01473 3.7181 12.036 3.7181 21.9314ZM21.6348 25.5147C23.5355 25.5147 25.3584 24.7597 26.7024 23.4157C28.0464 22.0717 28.8014 20.2488 28.8014 18.3481C28.8014 16.4473 28.0464 14.6245 26.7024 13.2805C25.3584 11.9365 23.5355 11.1814 21.6348 11.1814C19.734 11.1814 17.9112 11.9365 16.5672 13.2805C15.2232 14.6245 14.4681 16.4473 14.4681 18.3481C14.4681 20.2488 15.2232 22.0717 16.5672 23.4157C17.9112 24.7597 19.734 25.5147 21.6348 25.5147Z" fill="white"/>
                    </svg>
                </div>
                <span>{friend.name}</span>
                <span>{friend.elo}</span>
            </div>
            <button>View profil</button>
        </div>
    );
}

function FriendsList(props) {
    const { friends } = props;

    //Afficher les amis connectés en premier, si il y en a moins de 5, 
    //afficher les amis non connectés, affichage total de 5 amis

    const connectedFriends = friends.filter((friend) => friend.isOnline);

    const displayedFriends = connectedFriends.slice(0, 5);

    const remainingFriendsCount = 5 - displayedFriends.length;
    const remainingFriends = friends.filter((friend) => !friend.isOnline && !displayedFriends.includes(friend)).slice(0, remainingFriendsCount);

    const friendsToDisplay = [...displayedFriends, ...remainingFriends];

    return (
        <section className="FriendsList">
            <div>
                <div>
                    <h3>Amis ({friends.length})</h3>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_413_3306)">
                        <path d="M7.00568 22.5851L5.05762 20.5644L14.0846 11.2005L5.05762 1.83669L7.00568 -0.184082L17.9807 11.2005L7.00568 22.5851Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_413_3306">
                        <rect width="24" height="24" fill="white" transform="translate(0.134766 0.431396)"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
                <span className="separator"></span>
                {friendsToDisplay.map((friend) => (
                    <Friend friend={friend} key={friend.id} />
                ))}
            </div>
        </section>
    );
}


export default FriendsList;


/* usage

const friends = [
  { id: 1, name: "Alice", elo: 1400, isOnline: true },
  { id: 2, name: "Bob", elo: 1200, isOnline: true },
  { id: 3, name: "Charlie", elo: 1600, isOnline: false },
  { id: 4, name: "David", elo: 1100, isOnline: false },
  { id: 5, name: "Emma", elo: 1500, isOnline: true },
  { id: 6, name: "Frank", elo: 1300, isOnline: false },
];

function App() {
  return (
    <div>
      <FriendsList friends={friends} />
    </div>
  );
}

*/