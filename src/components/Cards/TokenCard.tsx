// Copyright (c) 2024, Wedi LLC. All rights reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { CardContent, Typography } from "@mui/joy";
import Card from "@mui/joy/Card";

import { Token } from "@/components/types";
import { tokenHelper } from "@/components/utils";
import Image from "next/image";

interface TokenCardProps {
  token?: Token;
  amount: string;
  onClick?: () => void;
}

/**
 * Token balance card.
 */
export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  amount,
  onClick,
}) => {
  const tokenMeta = tokenHelper(token?.name);

  return (
    <Card
      className={`rounded-lg bg-white ${onClick ? "cursor-pointer hover:bg-slate-50 transition-all" : ""}`}
      onClick={onClick}
    >
      <CardContent className="flex flex-row gap-6">
        {tokenMeta.svg !== "" ? (
          <Image
            alt="token"
            height={36}
            width={36}
            src={tokenMeta.svg}
            className="my-auto"
          />
        ) : (
          <ExclamationCircleIcon width={40} height={40} />
        )}
        <div>
          <Typography level="body-md">{tokenMeta.name}</Typography>

          <Typography level="body-sm">{`${amount} ${tokenMeta.name}`}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};
