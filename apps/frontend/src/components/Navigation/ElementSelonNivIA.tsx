import React from 'react';

interface LevelProps {
    level: number;
}

const ElementSelonNiveauIA: React.FC<LevelProps> = ({ level }) => {
    if (level == 1) {
        return (
            <div>
                <svg viewBox="0 0 118 117" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M97.6474 19.7618H87.9656V14.9209H100.068C101.423 14.9209 102.488 15.9859 102.488 17.3414V27.0231C102.488 28.3786 101.423 29.4435 100.068 29.4435H97.6474V34.2844H92.8065V24.6027H97.6474V19.7618ZM92.8065 43.9662H97.6474V39.1253H92.8065V43.9662ZM83.1248 14.9209H78.2839V34.2844H83.1248V14.9209ZM112.17 73.0114V87.534C112.17 90.1964 109.992 92.3748 107.329 92.3748H102.488V97.2157C102.488 102.589 98.1799 106.897 92.8065 106.897H25.0344C22.4666 106.897 20.004 105.877 18.1883 104.062C16.3727 102.246 15.3526 99.7834 15.3526 97.2157V92.3748H10.5118C7.84929 92.3748 5.6709 90.1964 5.6709 87.534V73.0114C5.6709 70.3489 7.84929 68.1705 10.5118 68.1705H15.3526C15.3526 49.4363 30.5045 34.2844 49.2387 34.2844H54.0796V28.1365C51.1751 26.4906 49.2387 23.3441 49.2387 19.7618C49.2387 14.4369 53.5955 10.0801 58.9204 10.0801C64.2454 10.0801 68.6022 14.4369 68.6022 19.7618C68.6022 23.3441 66.6658 26.4906 63.7613 28.1365V34.2844H68.6022C70.2481 34.2844 71.8456 34.4296 73.443 34.6717V48.807H96.3888C100.37 54.4781 102.501 61.2414 102.488 68.1705H107.329C109.992 68.1705 112.17 70.3489 112.17 73.0114ZM49.2387 75.4318C49.2387 72.2221 47.9637 69.1439 45.6941 66.8743C43.4245 64.6047 40.3462 63.3296 37.1365 63.3296C33.9268 63.3296 30.8486 64.6047 28.579 66.8743C26.3094 69.1439 25.0344 72.2221 25.0344 75.4318C25.0344 78.6415 26.3094 81.7197 28.579 83.9893C30.8486 86.2589 33.9268 87.534 37.1365 87.534C40.3462 87.534 43.4245 86.2589 45.6941 83.9893C47.9637 81.7197 49.2387 78.6415 49.2387 75.4318ZM92.8065 75.4318C92.8065 72.2221 91.5315 69.1439 89.2619 66.8743C86.9923 64.6047 83.914 63.3296 80.7043 63.3296C77.4947 63.3296 74.4164 64.6047 72.1468 66.8743C69.8772 69.1439 68.6022 72.2221 68.6022 75.4318C68.6022 78.6415 69.8772 81.7197 72.1468 83.9893C74.4164 86.2589 77.4947 87.534 80.7043 87.534C83.914 87.534 86.9923 86.2589 89.2619 83.9893C91.5315 81.7197 92.8065 78.6415 92.8065 75.4318ZM83.1248 39.1253H78.2839V43.9662H83.1248V39.1253Z" fill="black"/>
                </svg>
                <span>Très facile</span> 
                <span>(800 ELO)</span>
            </div>
        );
    }
    else if (level == 2) {
        return (
            <div>
                <svg viewBox="0 0 182 183" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M90.9997 15.3032C95.0221 15.3032 98.8798 16.9011 101.724 19.7454C104.568 22.5897 106.166 26.4474 106.166 30.4699C106.166 36.0816 103.133 41.0107 98.583 43.5891V53.2199H106.166C120.245 53.2199 133.747 58.8126 143.702 68.7676C153.657 78.7227 159.25 92.2246 159.25 106.303H166.833C168.844 106.303 170.773 107.102 172.195 108.524C173.617 109.946 174.416 111.875 174.416 113.887V136.637C174.416 138.648 173.617 140.577 172.195 141.999C170.773 143.421 168.844 144.22 166.833 144.22H159.25V151.803C159.25 155.826 157.652 159.683 154.807 162.528C151.963 165.372 148.105 166.97 144.083 166.97H37.9163C33.8939 166.97 30.0362 165.372 27.1919 162.528C24.3476 159.683 22.7497 155.826 22.7497 151.803V144.22H15.1663C13.1551 144.22 11.2263 143.421 9.80411 141.999C8.38196 140.577 7.58301 138.648 7.58301 136.637V113.887C7.58301 111.875 8.38196 109.946 9.80411 108.524C11.2263 107.102 13.1551 106.303 15.1663 106.303H22.7497C22.7497 92.2246 28.3424 78.7227 38.2974 68.7676C48.2525 58.8126 61.7544 53.2199 75.833 53.2199H83.4163V43.5891C78.8663 41.0107 75.833 36.0816 75.833 30.4699C75.833 26.4474 77.4309 22.5897 80.2752 19.7454C83.1195 16.9011 86.9772 15.3032 90.9997 15.3032ZM56.8747 98.7199C51.8466 98.7199 47.0245 100.717 43.4691 104.273C39.9137 107.828 37.9163 112.65 37.9163 117.678C37.9163 122.706 39.9137 127.528 43.4691 131.084C47.0245 134.639 51.8466 136.637 56.8747 136.637C61.9027 136.637 66.7249 134.639 70.2802 131.084C73.8356 127.528 75.833 122.706 75.833 117.678C75.833 112.65 73.8356 107.828 70.2802 104.273C66.7249 100.717 61.9027 98.7199 56.8747 98.7199ZM125.125 98.7199C120.097 98.7199 115.274 100.717 111.719 104.273C108.164 107.828 106.166 112.65 106.166 117.678C106.166 122.706 108.164 127.528 111.719 131.084C115.274 134.639 120.097 136.637 125.125 136.637C130.153 136.637 134.975 134.639 138.53 131.084C142.086 127.528 144.083 122.706 144.083 117.678C144.083 112.65 142.086 107.828 138.53 104.273C134.975 100.717 130.153 98.7199 125.125 98.7199Z" fill="black"/>
                </svg>
                <span>Facile</span> 
                <span>(1100 ELO)</span>
            </div>
        );
    }
    else if (level == 3) {
        return (
            <div>
                <svg viewBox="0 0 182 183" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M166.833 106.303H159.25C159.25 76.9557 135.514 53.2198 106.166 53.2198H98.583V43.589C100.889 42.2575 102.804 40.3423 104.135 38.0359C105.467 35.7295 106.167 33.1133 106.166 30.4504C106.166 27.7874 105.464 25.1716 104.131 22.8659C102.799 20.5602 100.883 18.646 98.5763 17.3157C96.2694 15.9854 93.6529 15.2859 90.9899 15.2876C88.327 15.2893 85.7114 15.9921 83.4062 17.3254C81.1011 18.6586 79.1876 20.5753 77.8581 22.8827C76.5287 25.1901 75.8303 27.8068 75.833 30.4698C75.833 36.0815 78.8663 41.0106 83.4163 43.589V53.2198H75.833C46.4855 53.2198 22.7497 76.9557 22.7497 106.303H15.1663C10.9955 106.303 7.58301 109.716 7.58301 113.886V136.636C7.58301 140.807 10.9955 144.22 15.1663 144.22H22.7497V151.803C22.7497 155.826 24.3476 159.683 27.1919 162.528C30.0362 165.372 33.8939 166.97 37.9163 166.97H144.083C152.501 166.97 159.25 160.221 159.25 151.803V144.22H166.833C171.004 144.22 174.416 140.807 174.416 136.636V113.886C174.416 109.716 171.004 106.303 166.833 106.303ZM56.8747 136.636C51.8466 136.636 47.0245 134.639 43.4691 131.084C39.9137 127.528 37.9163 122.706 37.9163 117.678C37.9163 111.46 40.9497 106 45.4997 102.511L74.5438 124.351C72.0413 131.48 64.9888 136.636 56.8747 136.636ZM125.125 136.636C117.011 136.636 109.958 131.48 107.456 124.351L136.5 102.511C141.05 106 144.083 111.46 144.083 117.678C144.083 122.706 142.086 127.528 138.53 131.084C134.975 134.639 130.153 136.636 125.125 136.636Z" fill="black"/>
                </svg>
                <span>Moyen</span> 
                <span>(1400 ELO)</span>
            </div>
        );
    }
    else if (level == 4) {
        return (
            <div>
                <svg viewBox="0 0 182 183" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M166.833 106.303H159.25C159.25 76.9556 135.514 53.2198 106.166 53.2198H98.583V43.589C100.889 42.2575 102.804 40.3423 104.135 38.0359C105.467 35.7295 106.167 33.1133 106.166 30.4504C106.166 27.7874 105.464 25.1716 104.131 22.8659C102.799 20.5602 100.883 18.646 98.5763 17.3157C96.2694 15.9854 93.6529 15.2859 90.9899 15.2876C88.327 15.2893 85.7114 15.9921 83.4062 17.3254C81.1011 18.6586 79.1876 20.5753 77.8581 22.8827C76.5287 25.1901 75.8303 27.8068 75.833 30.4698C75.833 36.0815 78.8663 41.0106 83.4163 43.589V53.2198H75.833C46.4855 53.2198 22.7497 76.9556 22.7497 106.303H15.1663C10.9955 106.303 7.58301 109.716 7.58301 113.886V136.636C7.58301 140.807 10.9955 144.22 15.1663 144.22H22.7497V151.803C22.7497 155.826 24.3476 159.683 27.1919 162.528C30.0362 165.372 33.8939 166.97 37.9163 166.97H144.083C152.501 166.97 159.25 160.221 159.25 151.803V144.22H166.833C171.004 144.22 174.416 140.807 174.416 136.636V113.886C174.416 109.716 171.004 106.303 166.833 106.303ZM56.8747 136.636C51.8466 136.636 47.0245 134.639 43.4691 131.084C39.9137 127.528 37.9163 122.706 37.9163 117.678C37.9163 111.46 40.9497 106 45.4997 102.511L74.5438 124.351C72.0413 131.48 64.9888 136.636 56.8747 136.636ZM125.125 136.636C117.011 136.636 109.958 131.48 107.456 124.351L136.5 102.511C141.05 106 144.083 111.46 144.083 117.678C144.083 122.706 142.086 127.528 138.53 131.084C134.975 134.639 130.153 136.636 125.125 136.636Z" fill="#D51010"/>
                </svg>
                <span>Difficile</span> 
                <span>(1700 ELO)</span>
            </div>
        );
    }
    else if (level == 0) {
        return (
            <div>
                <svg viewBox="0 0 182 183" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_452_3819)">
                        <path d="M15.1667 0.136719C6.825 0.136719 0 6.96172 0 15.3034V45.6367H15.1667V15.3034H45.5V0.136719H15.1667ZM136.5 0.136719V15.3034H166.833V45.6367H182V15.3034C182 6.96172 175.175 0.136719 166.833 0.136719H136.5ZM91 22.8867C57.6333 22.8867 30.3333 50.1867 30.3333 83.5534C30.3333 102.512 39.4333 119.953 53.0833 130.57V159.387H68.25V136.637H83.4167V159.387H98.5833V136.637H113.75V159.387H128.917V130.57C142.567 119.195 151.667 102.512 151.667 83.5534C151.667 50.1867 124.367 22.8867 91 22.8867ZM60.6667 106.303C52.325 106.303 45.5 99.4784 45.5 91.1367C45.5 82.7951 52.325 75.9701 60.6667 75.9701C69.0083 75.9701 75.8333 82.7951 75.8333 91.1367C75.8333 99.4784 69.0083 106.303 60.6667 106.303ZM79.625 121.47L91 98.7201L102.375 121.47H79.625ZM121.333 106.303C112.992 106.303 106.167 99.4784 106.167 91.1367C106.167 82.7951 112.992 75.9701 121.333 75.9701C129.675 75.9701 136.5 82.7951 136.5 91.1367C136.5 99.4784 129.675 106.303 121.333 106.303ZM0 136.637V166.97C0 175.312 6.825 182.137 15.1667 182.137H45.5V166.97H15.1667V136.637H0ZM166.833 136.637V166.97H136.5V182.137H166.833C175.175 182.137 182 175.312 182 166.97V136.637H166.833Z" fill="black"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_452_3819">
                            <rect width="182" height="182" fill="white" transform="translate(0 0.136719)"/>
                        </clipPath>
                    </defs>
                </svg>
                <span>Impossible</span> 
                <span>(2000 ELO)</span>
            </div>
        );
    }    
};

export default ElementSelonNiveauIA;
