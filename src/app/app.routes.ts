import { Routes } from '@angular/router';
import { ChannelChoice } from './channel-choice/channel-choice.component'
import { Channel } from './channel/channel.component'
import { Emote } from './emote/emote.component';
import { EmoteTop } from './emote-top/emote-top.component';
import { Chatter } from './chatter/chatter.component';
import { ChatterTop } from './chatter-top/chatter-top.component';
import { Follower } from './follower/follower.component';
import { FollowerABC } from './follower-abc/follower-abc.component';

export const routes: Routes = [
  { path: '',                             component: ChannelChoice },
  { path: ':channel',                     component: Channel },
  { path: ':channel/emote/7tv',           component: Emote },
  { path: ':channel/emote/7tv/top',       component: EmoteTop },
  { path: ':channel/chatter',             component: Chatter },
  { path: ':channel/chatter/top',         component: ChatterTop },
  { path: ':channel/follower',            component: Follower },
  { path: ':channel/follower/abc',        component: FollowerABC },
  { path: '**',                           redirectTo: '' }
  // alert
];
