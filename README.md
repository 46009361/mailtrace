# MailTrace — Email Path Visualizer

Visualize the path of your emails being delivered on Google Earth! In the midst of a private conversation I'm having IRL, I came up with this idea to make it easier for non-technical people to understand how their email hops from server to server.

## How to Use

1. Download a message you received from your email client
2. Edit any incorrect locations if necessary
   * Example: A Google data center in the United States being located in China
3. Visualize on Google Earth

> [!NOTE]
> If you get an alert saying only one hop shows, that's because the original email headers in the text of the file you chose don't contain multiple IP addresses in different `Received: …` headers, as their timestamps are used for routing the plane animation correctly. This depends on the original email file and cannot be fixed on my end.

### Internal to-do:

- [x] Change to `mailtrace` subdomain
