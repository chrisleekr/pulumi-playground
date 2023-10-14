import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { Output } from "@pulumi/pulumi";

export interface VpcArgs {
  numberOfAvailabilityZones: number;
}

export class Vpc extends pulumi.ComponentResource {
  public readonly vpcId: Output<string>;
  public readonly publicSubnetIds: Output<string[]>;

  constructor(
    name: string,
    args: VpcArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("pulumi-aws-sample:Vpc", name, args, opts);

    const vpc = new awsx.ec2.Vpc(
      name,
      {
        numberOfAvailabilityZones: args.numberOfAvailabilityZones,
      },
      {
        parent: this,
      }
    );

    this.vpcId = vpc.vpcId;

    this.publicSubnetIds = vpc.publicSubnetIds;

    this.registerOutputs();
  }
}
