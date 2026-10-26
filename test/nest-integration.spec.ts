// Boots the adapter inside a real Nest testing module, the way the nuvioo services use it: forRoot with the classes
// strategy, an AutomapperProfile registered as a provider, and @InjectMapper() into a service. The unit spec only
// exercises the pipe/interceptor with mocks, so this is what proves the declared Nest peer range.
import { AutoMap, classes } from '@automapper/classes';
import { createMap, forMember, mapFrom, type Mapper, type MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createRequire } from 'node:module';

import { AutomapperModule, AutomapperProfile, getMapperToken, InjectMapper } from '../src';

class UserEntity {
    @AutoMap()
    firstName!: string;

    @AutoMap()
    lastName!: string;
}

class UserDto {
    @AutoMap()
    firstName!: string;

    fullName!: string;
}

@Injectable()
class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                UserEntity,
                UserDto,
                forMember(
                    (d) => d.fullName,
                    mapFrom((s) => `${s.firstName} ${s.lastName}`),
                ),
            );
        };
    }
}

@Injectable()
class UserService {
    constructor(@InjectMapper() private readonly mapper: Mapper) {}

    toDto(entity: UserEntity): UserDto {
        return this.mapper.map(entity, UserEntity, UserDto);
    }
}

describe('AutomapperModule on NestJS', () => {
    it('runs on the Nest major this package declares', () => {
        const { version } = createRequire(import.meta.url)('@nestjs/core/package.json') as { version: string };
        expect(Number(version.split('.')[0])).toBeGreaterThanOrEqual(12);
    });

    it('forRoot provides the mapper, applies profiles and injects it with @InjectMapper()', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
            providers: [UserProfile, UserService],
        }).compile();
        await moduleRef.init();

        const entity = Object.assign(new UserEntity(), { firstName: 'Văn', lastName: 'An' });
        const dto = moduleRef.get(UserService).toDto(entity);
        expect(dto).toBeInstanceOf(UserDto);
        expect(dto).toMatchObject({ firstName: 'Văn', fullName: 'Văn An' });
        expect(moduleRef.get(getMapperToken())).toBeDefined();
        await moduleRef.close();
    });

    it('forRootAsync resolves the mapper options from a factory', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AutomapperModule.forRootAsync({ useFactory: () => ({ strategyInitializer: classes() }) })],
            providers: [UserProfile, UserService],
        }).compile();
        await moduleRef.init();

        const dto = moduleRef.get(UserService).toDto(Object.assign(new UserEntity(), { firstName: 'A', lastName: 'B' }));
        expect(dto.fullName).toBe('A B');
        await moduleRef.close();
    });
});
