
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold text-cricket-green-dark">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
