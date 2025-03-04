"use client";

import TablePage from "@/components/tabs/active-table/page";
import CreateJoinTable from "@/components/tabs/create-join/create-join";
import { useStore } from "@/lib/store";

const tabs = [
  {
    title: "Create or Join a Table",
    component: CreateJoinTable,
  },
  {
    title: "Active Table",
    component: TablePage,
  },
];

const HomePage = () => {
  const { activeTab } = useStore();

  const TabComponent = tabs[activeTab].component;

  return <TabComponent />;
};

export default HomePage;
