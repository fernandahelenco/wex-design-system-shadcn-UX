import{j as e,W as t}from"./index-DUYrlZui.js";import{C as r}from"./ComponentPage-RTGvM27O.js";import{S as n}from"./Section-BiJ_ZVBd.js";import{E as i,P as a,T as o}from"./PropsTable-DEcCGxW1.js";import{C as l}from"./CodeBlock-Btz2GuFG.js";import{W as s}from"./wex-spinner-DZ_ABDX7.js";import"./circle-question-mark-Cu9E47Sz.js";import"./triangle-alert-Bgk7t_j7.js";import"./sun-B3hEsg9G.js";import"./contrast-1QdVzTcJ.js";import"./eye-BMREQ8_8.js";import"./flask-conical-BrgdZ5Iz.js";import"./palette-cN_A1orJ.js";import"./prism-css-BIO5gTGk.js";import"./copy-vHNbD0RM.js";const d=[{name:"size",type:'"sm" | "md" | "lg"',default:'"md"',description:"Spinner size"},{name:"className",type:"string",description:"Additional CSS classes"}],c=[{element:"Spinner",property:"Color",token:"--primary"},{element:"Animation",property:"Type",token:"spin (CSS animation)"}];function w(){return e.jsxs(r,{title:"Spinner",description:"Loading spinner indicator for async operations.",status:"stable",registryKey:"spinner",children:[e.jsx(n,{title:"Overview",children:e.jsx(i,{children:e.jsx(s,{})})}),e.jsx(n,{title:"Variants",description:"Different spinner sizes and contexts.",children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(i,{title:"Sizes",description:"Different spinner sizes via className.",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{className:"h-4 w-4"}),e.jsx(s,{className:"h-6 w-6"}),e.jsx(s,{className:"h-8 w-8"}),e.jsx(s,{className:"h-12 w-12"})]})}),e.jsx(i,{title:"In Button",description:"Loading state in a button.",children:e.jsxs(t,{disabled:!0,children:[e.jsx(s,{className:"mr-2"}),"Loading..."]})}),e.jsx(i,{title:"Page Loading",description:"Centered loading indicator.",children:e.jsx("div",{className:"flex items-center justify-center p-12 border rounded-lg",children:e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(s,{className:"h-8 w-8"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Loading content..."})]})})})]})}),e.jsx(n,{title:"Accessibility",children:e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"ARIA Attributes"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:'WexSpinner includes role="status" and aria-label="Loading" by default. Screen readers will announce the loading state.'})]})}),e.jsx(n,{title:"Usage",children:e.jsx(l,{code:`import { WexSpinner, WexButton } from "@/components/wex";

// Basic spinner
<WexSpinner />

// Custom size
<WexSpinner className="h-8 w-8" />

// In a button
<WexButton disabled>
  <WexSpinner className="mr-2" />
  Loading...
</WexButton>

// Centered loading
<div className="flex items-center justify-center p-12">
  <WexSpinner className="h-8 w-8" />
</div>`})}),e.jsx(n,{title:"API Reference",children:e.jsx(a,{props:d})}),e.jsx(o,{tokens:c,className:"mt-12"})]})}export{w as default};
