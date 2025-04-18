import Header from "@/components/commons/Header";

const TravelPlanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default TravelPlanLayout;
