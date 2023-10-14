import { Vpc } from "./src/vpc";
import { ApplicationLoadBalancer } from "./src/alb";

const vpc = new Vpc("vpc", {
  numberOfAvailabilityZones: 2,
});

const alb = new ApplicationLoadBalancer("alb", {
  vpcId: vpc.vpcId,
  publicSubnetIds: vpc.publicSubnetIds,
});

export const albDefaultTargetGroup = alb.defaultTargetGroup;
