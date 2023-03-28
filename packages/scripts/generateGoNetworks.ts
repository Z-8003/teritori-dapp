import { NetworkKind } from "../networks";

let content = `
// Code generated by "generateGoNetworks.ts"; DO NOT EDIT.

package networks

import (
	"encoding/json"
	"github.com/pkg/errors"
)
`;

content += `
const (
  ${Object.entries(NetworkKind)
    .map(([name, str]) => `NetworkKind${name} = NetworkKind("${str}")`)
    .join("\n")}
)
`;

content += `
func UnmarshalNetwork(b []byte) (Network, error) {
	var base NetworkBase
	if err := json.Unmarshal(b, &base); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal network base")
	}
	switch base.Kind {
  ${Object.entries(NetworkKind)
    .filter(([str]) => str !== NetworkKind.Unknown)
    .map(
      ([name, str]) => `case NetworkKind${name}:
        var n ${name}Network
        if err := json.Unmarshal(b, &n); err != nil {
          return nil, errors.Wrap(err, "failed to unmarshal ${name} network")
        }
        return &n, nil
      `
    )
    .join("\n")}
	default:
		return &base, nil
	}
}
`;

for (const name of Object.keys(NetworkKind).filter(
  (val) => val !== NetworkKind.Unknown
)) {
  content += `
    func (netstore NetworkStore) Get${name}Network(id string) (*${name}Network, error) {
      network, err := netstore.GetNetwork(id)
      if err != nil {
        return nil, err
      }
      cn, ok := network.(*${name}Network)
      if !ok {
        return nil, ErrWrongType
      }
      return cn, nil
    }
    
    func (netstore NetworkStore) MustGet${name}Network(id string) *${name}Network {
      network, err := netstore.Get${name}Network(id)
      if err != nil {
        panic(err)
      }
      return network
    }

  `;
}

console.log(content);
