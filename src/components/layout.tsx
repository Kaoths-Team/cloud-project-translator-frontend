import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	return <div className="container p-4 m-auto bg-white">{children}</div>;
};

export default Layout;
