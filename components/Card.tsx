"use client";

import { useState } from "react";
import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";

const Card = ({ file }: { file: Models.Document }) => {
  // Hold the optimistic name in local state
  const [displayName, setDisplayName] = useState(file.name);

  return (
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown
            file={file}
            onOptimisticRename={(newName) => setDisplayName(newName)}
          />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        {/* Use the optimistic displayName instead of file.name */}
        <p className="subtitle-2 line-clamp-1">{displayName}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
