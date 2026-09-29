export interface ExampleItem {
  id: string;
  name: string;
  title: string;
  description: string;
  commands: string;
  transcriptExcerpt: string;
  screenshot: string;
  githubUrl: string;
}

export const examples: ExampleItem[] = [
  {
    id: "connect",
    name: "connect",
    title: "Connect to Your Own Browser",
    description:
      "cdpilot connect attaches to a browser you started yourself. cdpilot works in a tab of its own, stop leaves your browser running, and your tab keeps its unsaved draft.",
    commands: `cdpilot connect 59921
cdpilot go http://127.0.0.1:59922/page2.html
cdpilot content
cdpilot tabs
cdpilot shot output/screenshot.png
cdpilot stop
python3 -c "read user tab over CDP /json"
cdpilot disconnect`,
    transcriptExcerpt: `$ cdpilot tabs
  🟢 [0] cdpilot Page 2
       http://127.0.0.1:59922/page2.html
  🟢 [1] User Browser Page 1
       http://127.0.0.1:59922/page1.html

2 pages, 8 targets
$ cdpilot shot output/screenshot.png
output/screenshot.png (12.4KB)
$ cdpilot stop
connected browser left running; run \`cdpilot disconnect\` to forget it
$ python3 -c "read user tab over CDP /json"
User tab URL: http://127.0.0.1:59922/page1.html
User tab textarea value: my unsaved draft
$ cdpilot disconnect
Disconnected from Chrome/154.0.8037.58 (port 59921); your browser keeps running.`,
    screenshot: "/examples/connect.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/connect",
  },
  {
    id: "chrome-for-testing",
    name: "chrome-for-testing",
    title: "Chrome for Testing for Extension Development",
    description:
      "Chrome 137+ ignores unpacked extensions. cdpilot browser install chrome-for-testing downloads Google's test build (size and checksum verified), and a dev extension's content script runs on the page.",
    commands: `cdpilot browser install chrome-for-testing
cdpilot ext-install ../../test/fixtures/extension/unpacked
cdpilot browser chrome-for-testing
cdpilot go http://127.0.0.1:59924/index.html
cdpilot eval "document.documentElement.dataset.cdpilotExt"
cdpilot browser status
cdpilot shot output/screenshot.png
cdpilot stop`,
    transcriptExcerpt: `$ cdpilot go http://127.0.0.1:59924/index.html
  Dev extension injected: cdpilot e2e fixture/content.js
Chrome for Testing Demo

Extension test page
$ cdpilot eval "document.documentElement.dataset.cdpilotExt"
loaded:gldenfmenfgojdmdmnnocjgbdjeflelc`,
    screenshot: "/examples/chrome-for-testing.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/chrome-for-testing",
  },
  {
    id: "iframe",
    name: "iframe",
    title: "iframe Hopping",
    description:
      "This example demonstrates >>> frame hopping into both same-origin and cross-origin (OOPIF) iframes.",
    commands: `cdpilot launch
cdpilot go http://127.0.0.1:59861/index.html
cdpilot fill "iframe#same-frame >>> input#same-input" "Same Origin Text"
cdpilot fill "iframe#cross-frame >>> input#cross-input" "Cross Origin Text"
cdpilot shot output/screenshot.png
cdpilot stop`,
    transcriptExcerpt: `$ cdpilot fill "iframe#same-frame >>> input#same-input" "Same Origin Text"
Filled: INPUT = Same Origin Text
$ cdpilot fill "iframe#cross-frame >>> input#cross-input" "Cross Origin Text"
Filled: INPUT = Cross Origin Text`,
    screenshot: "/examples/iframe.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/iframe",
  },
  {
    id: "press-hold",
    name: "press-hold",
    title: "Press & Hold Like a Person",
    description:
      "This example demonstrates click --entropy=on measuring the realistic press-and-hold duration (mousedown to mouseup gap).",
    commands: `cdpilot launch
cdpilot go http://127.0.0.1:59863/index.html
cdpilot click "#target" --entropy=on
cdpilot content
cdpilot shot output/screenshot.png
cdpilot stop`,
    transcriptExcerpt: `$ cdpilot click "#target" --entropy=on
Clicked: BUTTON Click Me
$ cdpilot content
Press Hold Gap Measurement
Click Me
Mousedown -> Mouseup Gap: 56 ms`,
    screenshot: "/examples/press-hold.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/press-hold",
  },
  {
    id: "missed-click-exit-codes",
    name: "missed-click-exit-codes",
    title: "Missed-Click Exit Codes",
    description:
      "This example demonstrates missed click exit codes when an element is covered on mousedown (e.g. by an opening dropdown menu).",
    commands: `cdpilot launch
cdpilot go http://127.0.0.1:59864/index.html
cdpilot click "#target" --entropy=on
echo $?
cdpilot click "#normal" --entropy=on
echo $?
cdpilot shot output/screenshot.png
cdpilot stop`,
    transcriptExcerpt: `$ cdpilot click "#target" --entropy=on
note: #target was no longer under the mouse when the button was released (div#overlay was); the press and release reached the page, so no script click (it could click twice)
Pressed (released elsewhere, not clicked): BUTTON Open Covering Menu
$ echo $?
3
$ cdpilot click "#normal" --entropy=on
Clicked: BUTTON Normal Button
$ echo $?
0`,
    screenshot: "/examples/missed-click-exit-codes.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/missed-click-exit-codes",
  },
  {
    id: "webmcp",
    name: "webmcp",
    title: "WebMCP Bridge",
    description:
      "This example demonstrates enabling WebMCP via launch --webmcp, listing tools registered on a web page via document.modelContext, and invoking them with tools call.",
    commands: `cdpilot launch --webmcp
cdpilot go http://127.0.0.1:59865/shop.html
cdpilot tools list
cdpilot tools call add_to_cart '{"sku":"LAPTOP-01","qty":1}'
cdpilot shot output/screenshot.png
cdpilot stop`,
    transcriptExcerpt: `$ cdpilot tools list
4 WebMCP tools on http://127.0.0.1:59865/shop.html:
  add_to_cart  "Add to cart"  [consequential]
    Add a product to the shopping cart
    input: {"type": "object", "properties": {"sku": {"type": "string", "description": "Product SKU identifier"}, "qty": {"type": "integer", "description": "Quantity to add"}}, "required": ["sku", "qty"]}
  frame_echo
    Echo a text back from the same-origin iframe
    frame: http://127.0.0.1:59865/frame.html
    input: {"type": "object", "properties": {"text": {"type": "string", "description": "Text to echo"}}, "required": ["text"]}
  subscribe_newsletter  "Subscribe"  [form, autosubmit]
    Subscribe an email address to the store newsletter
    input: {"type": "object", "properties": {"email": {"type": "string", "description": "Customer email address"}}, "required": ["email"]}
  wait_for_abort
    Never finishes on its own; rejects when the execution is aborted
$ cdpilot tools call add_to_cart "{\\"sku\\":\\"LAPTOP-01\\",\\"qty\\":1}"
{
  "ok": true,
  "sku": "LAPTOP-01",
  "qty": 1,
  "cart_size": 1
}`,
    screenshot: "/examples/webmcp.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/webmcp",
  },
  {
    id: "web-bot-auth",
    name: "web-bot-auth",
    title: "Web Bot Auth Signatures",
    description:
      "This example demonstrates Web Bot Auth HTTP Message Signatures (RFC 9421) using the RFC 9421 Ed25519 TEST key.",
    commands: `cdpilot bot-auth status
cdpilot bot-auth directory --headers --authority example.com
cdpilot launch --bot-auth
cdpilot go https://http-message-signatures-example.research.cloudflare.com/
cdpilot content
cdpilot shot output/screenshot.png
cdpilot stop`,
    transcriptExcerpt: `  Bot Auth: signing every request as https://http-message-signatures-example.research.cloudflare.com (keyid poqkLGiymh_W0uP6PZFw-dvez3QJT5SolqXBCW38r0U, Signature-Agent legacy)
$ cdpilot go https://http-message-signatures-example.research.cloudflare.com/
Identify Bots with HTTP Message Signatures
You successfully authenticated as owning the test public key`,
    screenshot: "/examples/web-bot-auth.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/web-bot-auth",
  },
  {
    id: "plugin-install",
    name: "plugin-install",
    title: "Claude Code Plugin & .mcpb Bundle",
    description:
      "This example details how to register the cdpilot plugin marketplace, install the plugin, and build the .mcpb bundle using npm run build:mcpb.",
    commands: `/plugin marketplace add mehmetnadir/cdpilot
/plugin install cdpilot@cdpilot
npm run build:mcpb`,
    transcriptExcerpt: `Archive Details
name: cdpilot
version: 0.9.4
filename: cdpilot-0.9.4.mcpb
package size: 289.1kB
unpacked size: 967.9kB
shasum: 0b766905063affc5a7005e8fcc24b1874f6892e8
total files: 6
ignored (.mcpbignore) files: 1

Output: <repo>/cdpilot.mcpb
Verifying bundle info...
File: cdpilot.mcpb
Size: 289.15 KB

WARNING: Not signed
Built <repo>/cdpilot.mcpb`,
    screenshot: "/examples/plugin-install.png",
    githubUrl: "https://github.com/mehmetnadir/cdpilot/tree/main/examples/plugin-install",
  },
];
