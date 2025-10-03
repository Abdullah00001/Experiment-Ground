import { SIDENAV_ITEMS } from "./const.js";

const sidebarNav = document.getElementById("sidenav");

sidebarNav.innerHTML=SIDENAV_ITEMS.map((item)=>`
<li class="sidenav-item">
  <i class="${item.icon}"></i>
  <span>${item.name}</span>
</li>
`).join("");