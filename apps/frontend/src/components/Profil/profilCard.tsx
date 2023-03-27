import React from 'react';
// import './styles.css';

// //TODO: modif le css

// // Composants fonctionnels pour chaque information à afficher
// // `status` affiche si le joueur est en ligne ou hors ligne
// const Status = ({ status }) => {
//     return <span className="status">{`Status: ${status}`}</span>;
// }

// // `dateInscription` affiche la date d'inscription du joueur
// const MemberSince = ({ dateInscription }) => {
//     return <span className="membre_depuis_le_xx_xx_xxxx">{`Membre depuis le ${dateInscription}`}</span>;
// }

// // `elo` affiche l'ELO du joueur
// const Elo = ({ elo }) => {
//     return <span className="elo">{`ELO: ${elo}`}</span>;
// }

// // `pseudo` affiche le pseudo du joueur
// const Pseudo = ({ pseudo }) => {
//     return <span className="pseudo">{pseudo}</span>;
// }

// // `imageUrl` affiche l'image de profil du joueur
// const ProfilePicture = ({ imageUrl }) => {
//     return (
//         <div className="pfp">
//             <img src={imageUrl} alt="Profile picture" />
//         </div>
//     );
// }

// // `status`, `dateInscription`, `elo`, `pseudo`, et `imageUrl` sont passés en tant que props à `ProfileCard`
// const ProfileCard = ({ status, dateInscription, elo, pseudo, imageUrl }) => {
//     return (
//         <div className="cadre_principal_profil">
//             <div className="rectangle_115"></div>
//             <div className="group_168">
//                 <div className="info">
//                     <div className="alltxt">
//                         <div className="status_membredepuis">
//                             <Status status={status} />
//                             <MemberSince dateInscription={dateInscription} />
//                         </div>
//                         <div className="pseudo_elo">
//                             <Elo elo={elo} />
//                             <Pseudo pseudo={pseudo} />
//                         </div>
//                     </div>
//                     <ProfilePicture imageUrl={imageUrl} />
//                 </div>
//                 <div className="modif">
//                     <span className="modifier">Modifier</span>
//                     <div className="vector"></div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProfileCard;

// /* usage 

// <ProfileCard
//   status={user.status}
//   dateInscription={user.membersince}
//   elo={user.elo}
//   pseudo={user.pseudo}
// />

// <ProfileCard 
//   status="En ligne" 
//   dateInscription="01/01/2022" 
//   elo="2500" 
//   pseudo="joueur1"
//   imageUrl="https://example.com/profile.jpg"
// />

// */
