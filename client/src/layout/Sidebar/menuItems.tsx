interface menuItem {
  title: string;
  id: string;
  icon: JSX.Element;
  path: string;
}
const menuItems: menuItem[] = [
  {
    title: "Quản lý người dùng",
    id: "user",
    path: '/users',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  // {
  //   title: "Quản lý ứng dụng",
  //   id: "application",
  //   path: '/applications',
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       className="icon"
  //       fill="none"
  //       viewBox="0 0 24 24"
  //       stroke="currentColor"
  //       strokeWidth={2}
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
  //       />
  //     </svg>
  //   ),
  // },
  // {
  //   title: "Quản lý API",
  //   id: "api",
  //   path: '/apis',
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       className="icon"
  //       fill="none"
  //       viewBox="0 0 24 24"
  //       stroke="currentColor"
  //       strokeWidth={2}
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
  //       />
  //     </svg>
  //   ),
  // },
  {
    title: "Lịch sử gọi API",
    id: "api history",
    path: '/history',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default menuItems;
