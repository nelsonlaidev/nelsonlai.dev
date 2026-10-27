import type { InferRouterOutputs } from '@orpc/server'
import type { router } from '@repo/api/routers'

type Outputs = InferRouterOutputs<typeof router>
export type AdminUserListOutput = Outputs['admin']['user']['list']
export type AdminCommentListOutput = Outputs['admin']['comment']['list']
export type AdminRecentActivityOutput = Outputs['admin']['recentActivity']
