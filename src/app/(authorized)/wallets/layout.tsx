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

import { validOnboardStatus } from "@/components/utils";

import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const isValidOnboardStatus = session
    ? await validOnboardStatus(session)
    : false;

  if (!session || !isValidOnboardStatus) {
    redirect("/signin");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return <>{children}</>;
}