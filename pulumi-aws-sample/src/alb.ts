import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Output } from "@pulumi/pulumi";
import { TargetGroup } from "@pulumi/aws/lb";

export interface ApplicationLoadBalancerArgs {
  vpcId: pulumi.Input<string>;
  publicSubnetIds: pulumi.Input<string[]>;
}

export class ApplicationLoadBalancer extends pulumi.ComponentResource {
  public readonly defaultTargetGroup: Output<TargetGroup>;

  constructor(
    name: string,
    args: ApplicationLoadBalancerArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("pulumi-aws-sample:ApplicationLoadBalancer", name, args, opts);

    const securityGroup = new aws.ec2.SecurityGroup(
      `${name}-sg`,
      {
        vpcId: args.vpcId,
        ingress: [
          {
            fromPort: 80,
            toPort: 80,
            protocol: "tcp",
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
        egress: [
          {
            fromPort: 0,
            toPort: 0,
            protocol: "-1",
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
      },
      {
        parent: this,
      }
    );

    const alb = new awsx.lb.ApplicationLoadBalancer(
      name,
      {
        subnetIds: args.publicSubnetIds,
        securityGroups: [securityGroup.id],
        internal: true,
        listener: {
          port: 80,
          protocol: "HTTP",
        },
        defaultTargetGroup: {
          healthCheck: {
            path: "/health",
            port: "80",
          },
        },
      },
      {
        parent: this,
      }
    );

    this.defaultTargetGroup = alb.defaultTargetGroup;

    this.registerOutputs();
  }
}
